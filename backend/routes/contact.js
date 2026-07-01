import { Router } from "express";
import { submitContact, getMessages, markRead, deleteMessage } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validateUUID } from "../middleware/validation.js";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validation.js";

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  handleValidationErrors,
];

const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact message sent
 */
router.post("/", contactValidation, submitContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact messages (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contact messages
 */
router.get("/", protect, adminOnly, getMessages);

/**
 * @swagger
 * /contact/{id}/read:
 *   patch:
 *     summary: Mark message as read (admin only)
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.patch("/:id/read", protect, adminOnly, markRead);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Delete contact message (admin only)
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message deleted
 */
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
