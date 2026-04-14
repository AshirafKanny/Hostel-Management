import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "CheckedIn", "CheckedOut"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending", "Paid", "Refunded"],
      default: "Unpaid",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
