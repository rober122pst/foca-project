import express from 'express';
import authRoutes from '../auth/auth.events.js';
import dashboardRoutes from './dashboard.events.js';
import eventRoutes from './event.events.js';
import geminiRoutes from './gemini.events.js';
import pomodoroRoutes from './pomodoro.events.js';
import taskRoutes from './task.events.js';
import userRoutes from './user.events.js';

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