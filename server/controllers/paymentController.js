import asyncHandler from "express-async-handler";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import Fee from "../models/fee.js";

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method, transactionId, status, feeId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const resolvedStatus = status || "Completed";

  const payment = await Payment.create({
    booking: booking._id,
    fee: feeId,
    student: booking.student,
    amount,
    method,
    transactionId,
    status: resolvedStatus,
    paidAt: resolvedStatus === "Completed" ? new Date() : undefined,
    recordedBy: req.user?._id,
  });

  if (resolvedStatus === "Completed") {
    booking.paymentStatus = "Paid";
    booking.status = booking.status === "Pending" ? "Confirmed" : booking.status;
  } else {
    booking.paymentStatus = "Pending";
  }
  await booking.save();

  if (feeId) {
    const fee = await Fee.findById(feeId);
    if (fee) {
      if (resolvedStatus === "Completed") {
        fee.paymentStatus = "Paid";
        fee.paidAmount = amount;
        fee.paidDate = new Date();
      } else if (resolvedStatus === "Pending") {
        fee.paymentStatus = "Pending";
      } else if (resolvedStatus === "Failed") {
        fee.paymentStatus = "Overdue";
      }
      await fee.save();
    }
  }

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
