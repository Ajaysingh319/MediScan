import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Throttle auth attempts to blunt brute-force / spam signups.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many attempts. Try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, me);

export default router;
