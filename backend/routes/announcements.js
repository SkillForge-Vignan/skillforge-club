import { Router } from "express";
import { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../controllers/announcementsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();
router.get("/", getAnnouncements);
router.get("/:id", getAnnouncement);
router.post("/", protect, adminOnly, createAnnouncement);
router.put("/:id", protect, adminOnly, updateAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);
export default router;
