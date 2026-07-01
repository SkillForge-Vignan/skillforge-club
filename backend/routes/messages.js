import { Router } from "express";
import { protect, mentorOnly, studentOnly } from "../middleware/auth.js";
import {
  getConversation, sendMessage,
  getConversationAsStudent, sendMessageAsStudent,
  getUnreadCounts,
} from "../controllers/messagesController.js";

const router = Router();

// Mentor routes
router.get("/unread-counts",       protect, mentorOnly, getUnreadCounts);
router.get("/:studentId",          protect, mentorOnly, getConversation);
router.post("/:studentId",         protect, mentorOnly, sendMessage);

// Student routes
router.get("/student/:mentorId",   protect, studentOnly, getConversationAsStudent);
router.post("/student/:mentorId",  protect, studentOnly, sendMessageAsStudent);

export default router;
