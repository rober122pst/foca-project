import { createTask, deleteTask, updateTask } from '../controllers/tasks.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);

router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;