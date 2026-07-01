// Input validation schemas using express-validator
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Validation failed', errors.array()));
  }
  next();
};

// ─── AUTH VALIDATION ──────────────────────────────────────────────────────

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain number'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateOtp = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('otp')
    .trim()
    .matches(/^\d{6}$/).withMessage('OTP must be 6 digits'),
  handleValidationErrors,
];

export const validateSendOtp = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  handleValidationErrors,
];

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL'),
  handleValidationErrors,
];

// ─── EVENTS VALIDATION ────────────────────────────────────────────────────

export const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('date')
    .notEmpty().withMessage('Date is required'),
  body('time')
    .optional()
    .trim(),
  body('venue')
    .trim()
    .notEmpty().withMessage('Venue is required')
    .isLength({ max: 300 }).withMessage('Venue must be less than 300 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be 1-10000'),
  handleValidationErrors,
];

export const validateUpdateEvent = [
  param('id')
    .isUUID().withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be 1-10000'),
  handleValidationErrors,
];

// ─── PROJECTS VALIDATION ──────────────────────────────────────────────────

export const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body(['github_url', 'githubUrl'])
    .optional()
    .isURL().withMessage('Invalid GitHub URL'),
  body(['live_url', 'liveUrl'])
    .optional()
    .isURL().withMessage('Invalid live URL'),
  handleValidationErrors,
];

// ─── ASSIGNMENTS VALIDATION ────────────────────────────────────────────────

export const validateCreateAssignment = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  body('due_date')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors,
];

// ─── PAGINATION VALIDATION ────────────────────────────────────────────────

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  handleValidationErrors,
];

// ─── GENERIC ID VALIDATION ────────────────────────────────────────────────

export const validateUUID = [
  param('id')
    .isUUID().withMessage('Invalid ID format'),
  handleValidationErrors,
];
