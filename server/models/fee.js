import mongoose from "mongoose";

const feeSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    studentName: {
      type: String,
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    feeType: {
      type: String,
      required: true,
      enum: ["Room Rent", "Mess Fee", "Maintenance", "Security Deposit", "Other"],
      default: "Room Rent",
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Paid", "Pending", "Overdue", "Partial"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"],
    },
    transactionId: {
      type: String,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
