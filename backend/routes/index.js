import express from 'express';
import { getStatus } from '../controllers/index.js';

const router = express.Router();

// Basic route to check API status
router.get('/status', getStatus);

export default router;
