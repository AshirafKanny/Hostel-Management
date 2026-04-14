import express from "express";
import { createPayment, listPayments } from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createPayment).get(protect, admin, listPayments);

export default router;
