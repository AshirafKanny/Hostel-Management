import Student from "../models/student.js";
import Room from "../models/room.js";
import Fee from "../models/fee.js";
import Payment from "../models/payment.js";
import Complaint from "../models/complaint.js";
import Visitor from "../models/visitor.js";
import LeaveRequest from "../models/leaveRequest.js";
import Attendance from "../models/attendance.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Student statistics
    const totalStudents = await Student.countDocuments();
    const presentStudents = await Student.countDocuments({ status: "Present" });
    const absentStudents = await Student.countDocuments({ status: "Absent" });
    const onLeaveStudents = await Student.countDocuments({ status: "On Leave" });

    // Room statistics
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: "Available" });
    const occupiedRooms = await Room.countDocuments({ status: "Occupied" });
    const fullRooms = await Room.countDocuments({ status: "Full" });
    const maintenanceRooms = await Room.countDocuments({ status: "Maintenance" });

    // Fee statistics
    const totalFeesCollected = await Fee.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);

    const pendingFees = await Fee.aggregate([
      { $match: { paymentStatus: { $in: ["Pending", "Overdue"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const overdueFees = await Fee.countDocuments({ paymentStatus: "Overdue" });

    // Payment statistics
    const totalPaymentsCollected = await Payment.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const pendingPayments = await Payment.countDocuments({ status: "Pending" });

    // Complaint statistics
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: "Open" });
    const inProgressComplaints = await Complaint.countDocuments({
      status: "In Progress",
    });
    const resolvedComplaints = await Complaint.countDocuments({
      status: "Resolved",
    });

    // Visitor statistics
    const activeVisitors = await Visitor.countDocuments({ status: "Inside" });
    const todayVisitors = await Visitor.countDocuments({
      inTime: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    // Leave request statistics
    const pendingLeaveRequests = await LeaveRequest.countDocuments({
      status: "Pending",
    });
    const approvedLeaveRequests = await LeaveRequest.countDocuments({
      status: "Approved",
      fromDate: { $lte: new Date() },
      toDate: { $gte: new Date() },
    });

    res.json({
      students: {
        total: totalStudents,
        present: presentStudents,
        absent: absentStudents,
        onLeave: onLeaveStudents,
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        full: fullRooms,
        maintenance: maintenanceRooms,
      },
      fees: {
        collected: totalFeesCollected[0]?.total || 0,
        pending: pendingFees[0]?.total || 0,
        overdue: overdueFees,
      },
      payments: {
        collected: totalPaymentsCollected[0]?.total || 0,
        pending: pendingPayments,
      },
      complaints: {
        total: totalComplaints,
        open: openComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
      visitors: {
        active: activeVisitors,
        today: todayVisitors,
      },
      leaves: {
        pending: pendingLeaveRequests,
        activeLeaves: approvedLeaveRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private/Admin
const getRecentActivities = async (req, res) => {
  try {
    const recentComplaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category status createdAt");

    const recentVisitors = await Visitor.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("visitorName studentName roomNo status inTime");

    const pendingLeaves = await LeaveRequest.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("studentName leaveType fromDate toDate status");

    const recentFees = await Fee.find({ paymentStatus: "Paid" })
      .sort({ paidDate: -1 })
      .limit(5)
      .select("studentName amount feeType paidDate");

    res.json({
      complaints: recentComplaints,
      visitors: recentVisitors,
      leaves: pendingLeaves,
      fees: recentFees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDashboardStats, getRecentActivities };
