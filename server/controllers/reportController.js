import asyncHandler from "express-async-handler";
import Booking from "../models/booking.js";
import Payment from "../models/payment.js";
import Room from "../models/room.js";

// @desc    Get booking and payment metrics
// @route   GET /api/reports/summary
// @access  Private/Admin
const getReportSummary = asyncHandler(async (req, res) => {
  const bookingTotal = await Booking.countDocuments();
  const bookingConfirmed = await Booking.countDocuments({ status: "Confirmed" });
  const bookingPending = await Booking.countDocuments({ status: "Pending" });
  const bookingCancelled = await Booking.countDocuments({ status: "Cancelled" });

  const paymentTotal = await Payment.countDocuments();
  const paymentCompleted = await Payment.countDocuments({ status: "Completed" });
  const paymentPending = await Payment.countDocuments({ status: "Pending" });

  const roomTotal = await Room.countDocuments();
  const roomAvailable = await Room.countDocuments({ status: "Available" });

  res.json({
    bookings: {
      total: bookingTotal,
      confirmed: bookingConfirmed,
      pending: bookingPending,
      cancelled: bookingCancelled,
    },
    payments: {
      total: paymentTotal,
      completed: paymentCompleted,
      pending: paymentPending,
    },
    rooms: {
      total: roomTotal,
      available: roomAvailable,
    },
  });
});

// @desc    Evaluate booking efficiency
// @route   GET /api/reports/evaluation
// @access  Private/Admin
const getEvaluationMetrics = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ status: "Confirmed" });
  const cancelledBookings = await Booking.countDocuments({ status: "Cancelled" });

  const accuracy = totalBookings === 0 ? 0 : (confirmedBookings / totalBookings) * 100;
  const precision = totalBookings === 0 ? 0 : ((confirmedBookings - cancelledBookings) / totalBookings) * 100;
  const recall = totalBookings === 0 ? 0 : (confirmedBookings / totalBookings) * 100;

  res.json({
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    accuracy: Number(accuracy.toFixed(2)),
    precision: Number(precision.toFixed(2)),
    recall: Number(recall.toFixed(2)),
  });
});

export { getReportSummary, getEvaluationMetrics };
