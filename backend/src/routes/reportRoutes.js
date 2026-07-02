import { Router } from "express";
import { simplifyReport } from "../controllers/reportController.js";
import { uploadReportImage } from "../middleware/upload.js";
import { analyzeLimiter } from "../middleware/rateLimit.js";

const router = Router();

// POST /api/reports/simplify — accepts an image ("reportImage") or JSON { text }.
router.post("/simplify", analyzeLimiter, uploadReportImage, simplifyReport);

export default router;
