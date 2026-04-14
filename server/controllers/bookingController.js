import asyncHandler from "express-async-handler";
import Booking from "../models/booking.js";
import Room from "../models/room.js";
import Student from "../models/student.js";

const generateBookingCode = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK-${stamp}-${rand}`;
};

const toDate = (value) => (value ? new Date(value) : null);

const assertRoomAvailable = (room, requestedOccupancy = 1) => {
  if (!room) {
    const error = new Error("Room not found");
    error.statusCode = 404;
    throw error;
  }
  if (room.status === "Maintenance") {
    const error = new Error("Room under maintenance");
    error.statusCode = 400;
    throw error;
  }
  if (room.currentOccupancy + requestedOccupancy > room.capacity) {
    const error = new Error("Room is full");
    error.statusCode = 400;
    throw error;
  }
};

const updateRoomOccupancy = async (roomId, delta) => {
  const room = await Room.findById(roomId);
  if (!room) return;
  room.currentOccupancy = Math.max(0, room.currentOccupancy + delta);
  if (room.currentOccupancy === 0) {
    room.status = "Available";
  } else if (room.currentOccupancy >= room.capacity) {
    room.status = "Full";
  } else {
    room.status = "Occupied";
  }
  await room.save();
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { studentId, roomId, checkInDate, checkOutDate, totalAmount, notes } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const room = await Room.findById(roomId);
  assertRoomAvailable(room, 1);

  const booking = await Booking.create({
    student: student._id,
    room: room._id,
    bookingCode: generateBookingCode(),
    checkInDate: toDate(checkInDate),
    checkOutDate: toDate(checkOutDate),
    totalAmount,
    createdBy: req.user?._id,
    notes,
  });

  await updateRoomOccupancy(room._id, 1);

  res.status(201).json(booking);
});

// @desc    List bookings
// @route   GET /api/bookings
// @access  Private/Admin
const listBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("student", "name email roomNo")
    .populate("room", "roomNo blockNo roomType")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get booking by id
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("student", "name email roomNo")
    .populate("room", "roomNo blockNo roomType");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json(booking);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const previousStatus = booking.status;
  booking.status = status || booking.status;
  await booking.save();

  if (previousStatus !== "Cancelled" && booking.status === "Cancelled") {
    await updateRoomOccupancy(booking.room, -1);
  }
  if (previousStatus === "Cancelled" && booking.status !== "Cancelled") {
    await updateRoomOccupancy(booking.room, 1);
  }

  res.json(booking);
});

export { createBooking, listBookings, getBookingById, updateBookingStatus };
