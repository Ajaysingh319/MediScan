import { badRequest, AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";
import { signToken } from "../middleware/auth.js";
import { createUser, findByEmail, verifyPassword, publicUser } from "../services/userService.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCredentials = ({ email, password }) => {
  if (!email || !EMAIL_RE.test(email)) throw badRequest("Please enter a valid email address.", "INVALID_EMAIL");
  if (!password || password.length < 8)
    throw badRequest("Password must be at least 8 characters.", "WEAK_PASSWORD");
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !name.trim()) throw badRequest("Please enter your name.", "MISSING_NAME");
  validateCredentials({ email, password });

  if (findByEmail(email)) {
    throw new AppError(409, "An account with this email already exists.", "EMAIL_TAKEN");
  }

  const user = await createUser({ name, email, password });
  const token = signToken(user.id);
  logger.info("User registered", { id: user.id });
  res.status(201).json({ status: "success", token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  validateCredentials({ email, password });

  const row = findByEmail(email);
  // Same generic message whether the email or password is wrong (avoids leaking
  // which emails are registered).
  if (!row || !(await verifyPassword(password, row.password))) {
    throw new AppError(401, "Incorrect email or password.", "BAD_CREDENTIALS");
  }

  const token = signToken(row.id);
  logger.info("User logged in", { id: row.id });
  res.status(200).json({ status: "success", token, user: publicUser(row) });
});

export const me = (req, res) => {
  res.json({ status: "success", user: req.user });
};
