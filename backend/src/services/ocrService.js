import { createWorker } from "tesseract.js";
import { unprocessable, upstreamError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

/**
 * Runs OCR on an image buffer and returns the recognized text.
 * Throws a clean 422 if the image contains no readable text.
 */
export const performOCR = async (imageBuffer) => {
  let worker;
  try {
    worker = await createWorker("eng");
    // PSM 6 = assume a single uniform block of text; best for tabular reports.
    await worker.setParameters({ tessedit_pageseg_mode: "6" });

    logger.info("OCR: recognizing text from image");
    const result = await worker.recognize(imageBuffer);
    const text = result?.data?.text?.trim() || "";

    if (!text) {
      throw unprocessable(
        "We couldn't read any text from that image. Try a clearer, higher-resolution photo.",
        "OCR_EMPTY"
      );
    }

    logger.info("OCR: finished", { chars: text.length });
    return text;
  } catch (error) {
    if (error?.isOperational) throw error;
    logger.error("OCR failed", { message: error?.message });
    throw upstreamError("Failed to process the image. Please try again.", "OCR_FAILED");
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};
