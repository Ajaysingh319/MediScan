import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { findPublicById } from "../services/userService.js";

/** Signs a JWT for a user id. */
export const signToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

/**
 * Requires a valid Bearer token. Attaches the current user to req.user or
 * rejects with a clean 401.
 */
export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError(401, "Authentication required. Please log in.", "NO_TOKEN"));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = findPublicById(payload.sub);
    if (!user) {
      return next(new AppError(401, "Your session is no longer valid.", "USER_NOT_FOUND"));
    }
    req.user = user;
    next();
  } catch {
    next(new AppError(401, "Session expired or invalid. Please log in again.", "INVALID_TOKEN"));
  }
};
