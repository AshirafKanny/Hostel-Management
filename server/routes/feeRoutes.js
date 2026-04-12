import express from "express";
import {
  getAllFees,
  getFeesByStudentId,
  getPendingFees,
  createFee,
  updateFee,
  deleteFee,
  getFeeStats,
} from "../controllers/feeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllFees).post(protect, admin, createFee);
router.route("/pending").get(protect, getPendingFees);
router.route("/stats").get(protect, admin, getFeeStats);
router.route("/student/:studentId").get(protect, getFeesByStudentId);
router
  .route("/:id")
  .put(protect, admin, updateFee)
  .delete(protect, admin, deleteFee);

export default router;
