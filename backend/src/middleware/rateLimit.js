import rateLimit from "express-rate-limit";

/**
 * Each report analysis triggers paid LLM + CPU-heavy OCR work, so we cap how
 * often a single IP can hit the analyze endpoint to limit abuse and cost.
 */
export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 analyses per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    code: "RATE_LIMITED",
    message: "Too many requests. Please wait a few minutes and try again.",
  },
});
