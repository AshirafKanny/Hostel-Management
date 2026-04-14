import express from "express";
import { getReportSummary, getEvaluationMetrics } from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/summary").get(protect, admin, getReportSummary);
router.route("/evaluation").get(protect, admin, getEvaluationMetrics);

export default router;
