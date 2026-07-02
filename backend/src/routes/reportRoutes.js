import { Router } from "express";
import { simplifyReport } from "../controllers/reportController.js";
import { uploadReportImage } from "../middleware/upload.js";
import { analyzeLimiter } from "../middleware/rateLimit.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/reports/simplify — accepts an image ("reportImage") or JSON { text }.
// Requires a logged-in user.
router.post("/simplify", requireAuth, analyzeLimiter, uploadReportImage, simplifyReport);

export default router;
