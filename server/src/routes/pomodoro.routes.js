import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { createPomodoroSession } from '../controllers/pomodoro.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPomodoroSession)

export default router;