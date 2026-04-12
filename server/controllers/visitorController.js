import Visitor from "../models/visitor.js";

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private
const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({}).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active visitors (currently inside)
// @route   GET /api/visitors/active
// @access  Private
const getActiveVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: "Inside" }).sort({
      inTime: -1,
    });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get visitors by student ID
// @route   GET /api/visitors/student/:studentId
// @access  Private
const getVisitorsByStudentId = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a visitor
// @route   POST /api/visitors
// @access  Private
const registerVisitor = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      roomNo,
      visitorName,
      visitorContact,
      visitorId,
      relationship,
      purpose,
    } = req.body;

    const visitor = await Visitor.create({
      studentId,
      studentName,
      roomNo,
      visitorName,
      visitorContact,
      visitorId,
      relationship,
      purpose,
      approvedBy: req.user._id,
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark visitor as left
// @route   PUT /api/visitors/:id/checkout
// @access  Private
const checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (visitor) {
      visitor.status = "Left";
      visitor.outTime = new Date();

      const updatedVisitor = await visitor.save();
      res.json(updatedVisitor);
    } else {
      res.status(404).json({ message: "Visitor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete visitor record
// @route   DELETE /api/visitors/:id
// @access  Private/Admin
const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (visitor) {
      await visitor.deleteOne();
      res.json({ message: "Visitor record removed" });
    } else {
      res.status(404).json({ message: "Visitor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllVisitors,
  getActiveVisitors,
  getVisitorsByStudentId,
  registerVisitor,
  checkoutVisitor,
  deleteVisitor,
};
