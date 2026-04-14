import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["Cash", "MobileMoney", "Card", "BankTransfer"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
