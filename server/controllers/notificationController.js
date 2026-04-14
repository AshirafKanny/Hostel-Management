import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
  const { recipientType, recipientId, channel, subject, message } = req.body;

  const notification = await Notification.create({
    recipientType,
    recipientId,
    channel,
    subject,
    message,
    status: "Queued",
  });

  res.status(201).json(notification);
});

// @desc    List notifications
// @route   GET /api/notifications
// @access  Private/Admin
const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({}).sort({ createdAt: -1 });
  res.json(notifications);
});

export { createNotification, listNotifications };
