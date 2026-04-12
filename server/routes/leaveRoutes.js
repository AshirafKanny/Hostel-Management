import express from "express";
import {
  getAllLeaveRequests,
  getLeaveRequestsByStudentId,
  getPendingLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveRequestController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllLeaveRequests)
  .post(protect, createLeaveRequest);
router.route("/pending").get(protect, admin, getPendingLeaveRequests);
router.route("/student/:studentId").get(protect, getLeaveRequestsByStudentId);
router
  .route("/:id")
  .put(protect, admin, updateLeaveRequest)
  .delete(protect, admin, deleteLeaveRequest);

export default router;
