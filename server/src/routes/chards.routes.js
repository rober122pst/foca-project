import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { getTimeDistributionChard } from '../controllers/chards.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/time-distribution', getTimeDistributionChard);

export default router;
