import express from "express";
import {
  createBooking,
  listBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, admin, listBookings);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/status").put(protect, admin, updateBookingStatus);

export default router;
