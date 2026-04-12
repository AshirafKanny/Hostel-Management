import express from "express";
import {
  getAllVisitors,
  getActiveVisitors,
  getVisitorsByStudentId,
  registerVisitor,
  checkoutVisitor,
  deleteVisitor,
} from "../controllers/visitorController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllVisitors)
  .post(protect, registerVisitor);
router.route("/active").get(protect, getActiveVisitors);
router.route("/student/:studentId").get(protect, getVisitorsByStudentId);
router.route("/:id/checkout").put(protect, checkoutVisitor);
router.route("/:id").delete(protect, admin, deleteVisitor);

export default router;
