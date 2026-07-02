import multer from "multer";
import { badRequest } from "../utils/AppError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

/**
 * In-memory upload restricted to reasonable image types and sizes so a huge
 * or malicious file can't tie up the OCR worker or exhaust memory.
 */
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(badRequest("Only PNG, JPG, or WEBP images are allowed.", "INVALID_FILE_TYPE"));
    }
  },
});

/**
 * Wraps multer so its errors (e.g. file too large) become clean AppErrors
 * handled by the central error handler instead of raw multer errors.
 */
export const uploadReportImage = (req, res, next) => {
  multerUpload.single("reportImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(badRequest("Image is too large (max 5 MB).", "FILE_TOO_LARGE"));
      }
      return next(badRequest(err.message, "UPLOAD_ERROR"));
    }
    if (err) return next(err);
    next();
  });
};
