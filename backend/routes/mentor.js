import { Router } from "express";
import { getMentorOverview, getMentorStudents, getMentorTasks, createTask, deleteTask, getMentorProfile } from "../controllers/mentorController.js";
import { protect, mentorOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect, mentorOnly);
router.get("/overview",  getMentorOverview);
router.get("/students",  getMentorStudents);
router.get("/tasks",     getMentorTasks);
router.post("/tasks",    createTask);
router.delete("/tasks/:id", deleteTask);
router.get("/profile",   getMentorProfile);
export default router;
