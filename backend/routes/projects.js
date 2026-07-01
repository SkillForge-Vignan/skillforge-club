import { Router } from "express";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectsController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validateCreateProject, validateUUID } from "../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/", getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project details
 */
router.get("/:id", validateUUID, getProject);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tech_stack:
 *                 type: array
 *                 items:
 *                   type: string
 *               github_url:
 *                 type: string
 *               live_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post("/", validateCreateProject, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put("/:id", validateUUID, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete("/:id", validateUUID, deleteProject);

export default router;
