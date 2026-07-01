import { Router } from "express";
import { getAssignments, assignStudentToMentor, removeAssignment, getMentorsList, getMyMentor } from "../controllers/assignmentController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validateUUID } from "../middleware/validation.js";

const router = Router();

// Admin only
/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments (admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get("/",           protect, adminOnly, getAssignments);

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Assign student to mentor (admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post("/",          protect, adminOnly, assignStudentToMentor);

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Remove assignment (admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Assignment removed
 */
router.delete("/:id",     protect, adminOnly, validateUUID, removeAssignment);

/**
 * @swagger
 * /assignments/mentors:
 *   get:
 *     summary: Get mentors list (admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mentors
 */
router.get("/mentors",    protect, adminOnly, getMentorsList);

// Student - get their own mentor
/**
 * @swagger
 * /assignments/my-mentor:
 *   get:
 *     summary: Get your assigned mentor
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your mentor details
 */
router.get("/my-mentor",  protect, getMyMentor);

export default router;
