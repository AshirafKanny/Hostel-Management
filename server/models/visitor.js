import mongoose from "mongoose";

const visitorSchema = mongoose.Schema(
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
    visitorName: {
      type: String,
      required: true,
    },
    visitorContact: {
      type: String,
      required: true,
    },
    visitorId: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    inTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    outTime: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["Inside", "Left"],
      default: "Inside",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
