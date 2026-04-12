import express from "express";
import {
  getDashboardStats,
  getRecentActivities,
} from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/stats").get(protect, admin, getDashboardStats);
router.route("/activities").get(protect, admin, getRecentActivities);

export default router;
