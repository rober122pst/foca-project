import { getEventsData, getOverviewData } from '../controllers/dashboard.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', getOverviewData);
router.get('/routines', getEventsData);

export default router;
