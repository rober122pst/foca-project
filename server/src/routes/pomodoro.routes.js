import { createPomodoroSession, getPomodoroSession } from '../controllers/pomodoro.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPomodoroSession);
router.get('/:id', getPomodoroSession);

export default router;