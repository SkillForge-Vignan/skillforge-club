import { Router } from "express";
import { getAssignments, assignStudentToMentor, removeAssignment, getMentorsList, getMyMentor } from "../controllers/assignmentController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Admin only
router.get("/",           protect, adminOnly, getAssignments);
router.post("/",          protect, adminOnly, assignStudentToMentor);
router.delete("/:id",     protect, adminOnly, removeAssignment);
router.get("/mentors",    protect, adminOnly, getMentorsList);

// Student — get their own mentor
router.get("/my-mentor",  protect, getMyMentor);

export default router;
