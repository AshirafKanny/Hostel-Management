import Notice from "../models/notice.js";

// @desc    Get all active notices
// @route   GET /api/notices
// @access  Public
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      isActive: true,
      validTill: { $gte: new Date() },
    }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notices (including inactive)
// @route   GET /api/notices/all
// @access  Private/Admin
const getAllNoticesAdmin = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (notice) {
      res.json(notice);
    } else {
      res.status(404).json({ message: "Notice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      validTill,
      attachments,
    } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category,
      postedBy: req.user._id,
      postedByName: req.user.name,
      priority,
      validTill,
      attachments,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      notice.title = req.body.title || notice.title;
      notice.content = req.body.content || notice.content;
      notice.category = req.body.category || notice.category;
      notice.priority = req.body.priority || notice.priority;
      notice.validTill = req.body.validTill || notice.validTill;
      notice.attachments = req.body.attachments || notice.attachments;
      notice.isActive =
        req.body.isActive !== undefined ? req.body.isActive : notice.isActive;

      const updatedNotice = await notice.save();
      res.json(updatedNotice);
    } else {
      res.status(404).json({ message: "Notice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      await notice.deleteOne();
      res.json({ message: "Notice removed" });
    } else {
      res.status(404).json({ message: "Notice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
