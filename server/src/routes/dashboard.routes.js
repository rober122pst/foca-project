import { getOverviewData, getRoutinesData } from '../controllers/dashboard.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', getOverviewData);
router.get('/routines', getRoutinesData);

export default router;
