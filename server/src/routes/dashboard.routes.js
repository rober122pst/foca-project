import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { getOverviewData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', getOverviewData);

export default router;
