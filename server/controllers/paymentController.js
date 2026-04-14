import asyncHandler from "express-async-handler";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method, transactionId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const payment = await Payment.create({
    booking: booking._id,
    student: booking.student,
    amount,
    method,
    transactionId,
    status: "Completed",
    paidAt: new Date(),
    recordedBy: req.user?._id,
  });

  booking.paymentStatus = "Paid";
  booking.status = booking.status === "Pending" ? "Confirmed" : booking.status;
  await booking.save();

  res.status(201).json(payment);
});

// @desc    List payments
// @route   GET /api/payments
// @access  Private/Admin
const listPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate("booking", "bookingCode totalAmount status")
    .populate("student", "name email")
    .sort({ createdAt: -1 });
  res.json(payments);
});

export { createPayment, listPayments };
