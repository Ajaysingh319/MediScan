import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { env } from "../config/env.js";
import { unprocessable, upstreamError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(env.aiApiKey);

const AI_TIMEOUT_MS = 30_000;

/** Rejects if the wrapped promise doesn't settle within `ms`. */
const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(upstreamError(`AI request timed out (${label}).`, "AI_TIMEOUT")),
        ms
      )
    ),
  ]);

/**
 * Calls Gemini with a forced JSON response schema, so the model returns valid
 * structured JSON directly — no fragile markdown-fence stripping required.
 */
const callAI = async (prompt, responseSchema, label) => {
  const model = genAI.getGenerativeModel({
    model: env.aiModel,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    },
  });

  try {
    const result = await withTimeout(model.generateContent(prompt), AI_TIMEOUT_MS, label);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    if (error?.isOperational) throw error;
    logger.error("AI call failed", { label, message: error?.message });
    throw upstreamError("The AI model could not process this report. Please try again.", "AI_FAILED");
  }
};

// --- Response schemas -------------------------------------------------------

const testsSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tests: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          value: { type: SchemaType.NUMBER },
          unit: { type: SchemaType.STRING },
          ref_range: {
            type: SchemaType.OBJECT,
            properties: {
              low: { type: SchemaType.NUMBER },
              high: { type: SchemaType.NUMBER },
            },
          },
        },
        required: ["name", "value", "unit"],
      },
    },
  },
  required: ["tests"],
};

const summarySchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    explanations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    advice: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["summary", "explanations", "advice"],
};

// --- Orchestration ----------------------------------------------------------

/**
 * Turns raw (OCR'd or pasted) report text into a structured, patient-friendly
 * report: normalized tests, code-computed status, a plain-language summary,
 * per-finding explanations, and general diet/lifestyle advice.
 */
export const getSimplifiedReport = async (rawText) => {
  // === AI Call #1: Parse + normalize in a single structured call ===
  logger.info("AI: parsing & normalizing tests");
  const parsePrompt = `
You are an expert medical lab data extraction and normalization engine.
Extract every distinct test result from the report text below and return structured data.

RULES:
- Correct obvious OCR spelling errors (e.g. "Hemglobin" -> "Hemoglobin").
- Standardize common test names (e.g. "Total Leucocyte Count" -> "WBC").
- Ignore headers, footers, patient info, and any non-test text.
- "value" must be a number; pay close attention to decimal points.
- "ref_range" is the normal reference interval as { low, high } numbers. Omit ref_range only if truly not derivable.
- DO NOT include a status field — status is computed separately.

Report text:
"""${rawText}"""
`;
  const parsed = await callAI(parsePrompt, testsSchema, "parse");
  const testsWithoutStatus = Array.isArray(parsed?.tests) ? parsed.tests : [];

  if (testsWithoutStatus.length === 0) {
    throw unprocessable(
      "We couldn't find any recognizable test results in that report. Please check the input.",
      "NO_TESTS_FOUND"
    );
  }

  // === Code logic: compute status (deterministic, not AI) ===
  const normalizedTests = testsWithoutStatus.map((test) => {
    let status = "normal";
    if (
      test.ref_range &&
      typeof test.value === "number" &&
      typeof test.ref_range.low === "number" &&
      typeof test.ref_range.high === "number"
    ) {
      if (test.value < test.ref_range.low) status = "low";
      else if (test.value > test.ref_range.high) status = "high";
    } else {
      status = "unknown";
    }
    return { ...test, status };
  });

  const abnormal = normalizedTests.filter((t) => t.status === "low" || t.status === "high");

  // === AI Call #2: Patient-friendly summary + advice ===
  logger.info("AI: generating summary & advice", { tests: normalizedTests.length, abnormal: abnormal.length });
  const summaryPrompt = `
You are a compassionate medical scribe explaining lab results to a non-medical patient.

CRITICAL SAFETY RULES:
- DO NOT diagnose, prescribe, or give specific medical treatment.
- Be reassuring, simple, and empathetic.
- "summary": one brief sentence highlighting the key abnormal findings (or a reassuring line if all normal).
- "explanations": one short plain-language line per abnormal result.
- "advice": 2-4 general, safe diet/lifestyle tips relevant to the findings. Always frame as general wellness, never as treatment. If everything is normal, give general healthy-living tips.

Structured data: ${JSON.stringify(normalizedTests)}
`;
  const summaryData = await callAI(summaryPrompt, summarySchema, "summary");

  logger.info("AI: report assembled");
  return {
    tests: normalizedTests,
    summary: summaryData.summary,
    explanations: Array.isArray(summaryData.explanations) ? summaryData.explanations : [],
    advice: Array.isArray(summaryData.advice) ? summaryData.advice : [],
    meta: {
      totalTests: normalizedTests.length,
      abnormalCount: abnormal.length,
      generatedAt: new Date().toISOString(),
    },
  };
};
