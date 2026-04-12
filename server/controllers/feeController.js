import Fee from "../models/fee.js";

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find({}).sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fee by student ID
// @route   GET /api/fees/student/:studentId
// @access  Private
const getFeesByStudentId = async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId }).sort({
      createdAt: -1,
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending fees
// @route   GET /api/fees/pending
// @access  Private
const getPendingFees = async (req, res) => {
  try {
    const fees = await Fee.find({
      paymentStatus: { $in: ["Pending", "Overdue", "Partial"] },
    }).sort({ dueDate: 1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a fee record
// @route   POST /api/fees
// @access  Private/Admin
const createFee = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      roomNo,
      amount,
      feeType,
      month,
      year,
      dueDate,
      remarks,
    } = req.body;

    const fee = await Fee.create({
      studentId,
      studentName,
      roomNo,
      amount,
      feeType,
      month,
      year,
      dueDate,
      remarks,
    });

    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee record (payment)
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      fee.paymentStatus = req.body.paymentStatus || fee.paymentStatus;
      fee.paymentMethod = req.body.paymentMethod || fee.paymentMethod;
      fee.transactionId = req.body.transactionId || fee.transactionId;
      fee.paidAmount = req.body.paidAmount !== undefined ? req.body.paidAmount : fee.paidAmount;
      fee.paidDate = req.body.paidDate || fee.paidDate;
      fee.remarks = req.body.remarks || fee.remarks;

      const updatedFee = await fee.save();
      res.json(updatedFee);
    } else {
      res.status(404).json({ message: "Fee record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fee record
// @route   DELETE /api/fees/:id
// @access  Private/Admin
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      await fee.deleteOne();
      res.json({ message: "Fee record removed" });
    } else {
      res.status(404).json({ message: "Fee record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fee statistics
// @route   GET /api/fees/stats
// @access  Private/Admin
const getFeeStats = async (req, res) => {
  try {
    const totalPaid = await Fee.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);

    const totalPending = await Fee.aggregate([
      { $match: { paymentStatus: { $in: ["Pending", "Overdue"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const overdueCount = await Fee.countDocuments({ paymentStatus: "Overdue" });

    res.json({
      totalPaid: totalPaid[0]?.total || 0,
      totalPending: totalPending[0]?.total || 0,
      overdueCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllFees,
  getFeesByStudentId,
  getPendingFees,
  createFee,
  updateFee,
  deleteFee,
  getFeeStats,
};
