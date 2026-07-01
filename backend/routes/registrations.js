import { Router } from "express";
import { registerForEvent, getAllRegistrations, getMyRegistrations, cancelRegistration, getStats } from "../controllers/registrationsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();
router.post("/", registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.get("/stats", protect, adminOnly, getStats);
router.get("/", protect, adminOnly, getAllRegistrations);
router.delete("/:id", protect, adminOnly, cancelRegistration);
export default router;
