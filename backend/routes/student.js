import { Router } from "express";
import { getOverview, getAssignments, completeAssignment, getProgress, getProfile, updateProfile } from "../controllers/studentController.js";
import { protect, studentOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect, studentOnly);
router.get("/overview", getOverview);
router.get("/assignments", getAssignments);
router.patch("/assignments/:id", completeAssignment);
router.get("/progress", getProgress);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
export default router;
