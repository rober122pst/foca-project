import express from 'express';
import authRoutes from '../auth/auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import eventRoutes from './event.routes.js';
import geminiRoutes from './gemini.routes.js';
import pomodoroRoutes from './pomodoro.routes.js';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

// Usar rotas
router.use('/auth', authRoutes);
router.use('/user/pomodoro', pomodoroRoutes)
router.use('/user/events', eventRoutes);
router.use('/user/tasks', taskRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', geminiRoutes);

export default router;