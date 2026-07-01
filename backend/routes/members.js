import { Router } from "express";
import { getMembers, getMember, deleteMember, getMemberStats } from "../controllers/membersController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validateUUID } from "../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members (admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 *       403:
 *         description: Admin access required
 */
router.get("/", protect, adminOnly, getMembers);

/**
 * @swagger
 * /members/stats:
 *   get:
 *     summary: Get member statistics (admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member statistics
 */
router.get("/stats", protect, adminOnly, getMemberStats);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get member by ID (admin only)
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member details
 */
router.get("/:id", protect, adminOnly, validateUUID, getMember);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete member (admin only)
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member deleted
 */
router.delete("/:id", protect, adminOnly, validateUUID, deleteMember);

export default router;
