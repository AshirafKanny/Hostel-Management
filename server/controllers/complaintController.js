import Complaint from "../models/complaint.js";

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints by student ID
// @route   GET /api/complaints/student/:studentId
// @access  Private
const getComplaintsByStudentId = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get open complaints
// @route   GET /api/complaints/open
// @access  Private
const getOpenComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: { $in: ["Open", "In Progress"] },
    }).sort({ priority: -1, createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      roomNo,
      category,
      title,
      description,
      priority,
    } = req.body;

    const complaint = await Complaint.create({
      studentId,
      studentName,
      roomNo,
      category,
      title,
      description,
      priority,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = req.body.status || complaint.status;
      complaint.priority = req.body.priority || complaint.priority;
      complaint.assignedTo = req.body.assignedTo || complaint.assignedTo;
      complaint.remarks = req.body.remarks || complaint.remarks;

      if (req.body.status === "Resolved" || req.body.status === "Closed") {
        complaint.resolvedDate = new Date();
      }

      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      await complaint.deleteOne();
      res.json({ message: "Complaint removed" });
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllComplaints,
  getComplaintsByStudentId,
  getOpenComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};
