import express from "express";
import {
  getAllNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllNotices).post(protect, admin, createNotice);
router.route("/all").get(protect, admin, getAllNoticesAdmin);
router
  .route("/:id")
  .get(getNoticeById)
  .put(protect, admin, updateNotice)
  .delete(protect, admin, deleteNotice);

export default router;
