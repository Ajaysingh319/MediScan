/**
 * Operational error with an HTTP status code and a client-safe message.
 * Anything thrown as an AppError is intentional and safe to show the user;
 * anything else is treated as an unexpected 500.
 */
export class AppError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || "ERROR";
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const badRequest = (message, code = "BAD_REQUEST") =>
  new AppError(400, message, code);

export const unprocessable = (message, code = "UNPROCESSABLE") =>
  new AppError(422, message, code);

export const upstreamError = (message, code = "UPSTREAM_ERROR") =>
  new AppError(502, message, code);
