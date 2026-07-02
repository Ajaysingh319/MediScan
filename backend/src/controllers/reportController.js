import { performOCR } from "../services/ocrService.js";
import { getSimplifiedReport } from "../services/aiService.js";
import { badRequest } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

const MAX_TEXT_LENGTH = 20_000;

/** Wraps an async handler so thrown/rejected errors reach the central handler. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const simplifyReport = asyncHandler(async (req, res) => {
  let rawText;

  if (req.file) {
    logger.info("Report received via image upload", { size: req.file.size });
    rawText = await performOCR(req.file.buffer);
  } else if (req.body?.text && typeof req.body.text === "string" && req.body.text.trim()) {
    const text = req.body.text.trim();
    if (text.length > MAX_TEXT_LENGTH) {
      throw badRequest(`Text is too long (max ${MAX_TEXT_LENGTH} characters).`, "TEXT_TOO_LONG");
    }
    logger.info("Report received via pasted text", { chars: text.length });
    rawText = text;
  } else {
    throw badRequest(
      'Provide either an image (form field "reportImage") or non-empty "text" in the JSON body.',
      "NO_INPUT"
    );
  }

  const report = await getSimplifiedReport(rawText);

  res.status(200).json({ status: "success", report });
});
