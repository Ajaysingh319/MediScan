import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import { isProd } from "../config/env.js";

/** 404 handler for unmatched routes. */
export const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Central error handler. Operational AppErrors surface their message and code
 * to the client; anything unexpected is logged in full and returned as a
 * generic 500 so we never leak internals or stack traces.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError && err.isOperational) {
    logger.warn("Handled error", { code: err.code, message: err.message });
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message,
    });
  }

  logger.error("Unexpected error", {
    message: err?.message,
    stack: isProd ? undefined : err?.stack,
  });

  res.status(500).json({
    status: "error",
    code: "INTERNAL_ERROR",
    message: "Something went wrong while analyzing the report. Please try again.",
  });
};
