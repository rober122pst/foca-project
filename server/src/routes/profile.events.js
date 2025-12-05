import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { getProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);

export default router;
