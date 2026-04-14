import express from "express";
import {
  createNotification,
  listNotifications,
} from "../controllers/notificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, admin, createNotification).get(protect, admin, listNotifications);

export default router;
