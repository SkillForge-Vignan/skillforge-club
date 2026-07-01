import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe, updateMe, getAllUsers } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/users", protect, adminOnly, getAllUsers);

export default router;
