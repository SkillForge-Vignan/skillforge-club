import { Router } from "express";
import { getTeam, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", getTeam);
router.get("/:id", getTeamMember);
router.post("/", protect, adminOnly, upload.single("avatar"), createTeamMember);
router.put("/:id", protect, adminOnly, upload.single("avatar"), updateTeamMember);
router.delete("/:id", protect, adminOnly, deleteTeamMember);
export default router;
