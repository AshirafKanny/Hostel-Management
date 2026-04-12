import LeaveRequest from "../models/leaveRequest.js";

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({}).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leave requests by student ID
// @route   GET /api/leaves/student/:studentId
// @access  Private
const getLeaveRequestsByStudentId = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending leave requests
// @route   GET /api/leaves/pending
// @access  Private
const getPendingLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({
      status: "Pending",
    }).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a leave request
// @route   POST /api/leaves
// @access  Private
const createLeaveRequest = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      roomNo,
      leaveType,
      fromDate,
      toDate,
      reason,
      contactDuringLeave,
      address,
    } = req.body;

    const leaveRequest = await LeaveRequest.create({
      studentId,
      studentName,
      roomNo,
      leaveType,
      fromDate,
      toDate,
      reason,
      contactDuringLeave,
      address,
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave request (approve/reject)
// @route   PUT /api/leaves/:id
// @access  Private/Admin
const updateLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (leaveRequest) {
      leaveRequest.status = req.body.status || leaveRequest.status;
      leaveRequest.remarks = req.body.remarks || leaveRequest.remarks;

      if (req.body.status === "Approved" || req.body.status === "Rejected") {
        leaveRequest.approvedBy = req.user._id;
        leaveRequest.approvalDate = new Date();
      }

      const updatedLeaveRequest = await leaveRequest.save();
      res.json(updatedLeaveRequest);
    } else {
      res.status(404).json({ message: "Leave request not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private/Admin
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (leaveRequest) {
      await leaveRequest.deleteOne();
      res.json({ message: "Leave request removed" });
    } else {
      res.status(404).json({ message: "Leave request not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllLeaveRequests,
  getLeaveRequestsByStudentId,
  getPendingLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
};
