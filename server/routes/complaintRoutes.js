import express from "express";
import {
  getAllComplaints,
  getComplaintsByStudentId,
  getOpenComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllComplaints)
  .post(protect, createComplaint);
router.route("/open").get(protect, getOpenComplaints);
router.route("/student/:studentId").get(protect, getComplaintsByStudentId);
router
  .route("/:id")
  .put(protect, admin, updateComplaint)
  .delete(protect, admin, deleteComplaint);

export default router;
