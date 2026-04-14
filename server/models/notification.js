import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["Student", "User"],
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    channel: {
      type: String,
      enum: ["Email", "SMS", "InApp"],
      default: "InApp",
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Queued", "Sent", "Failed"],
      default: "Queued",
    },
    sentAt: {
      type: Date,
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

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
