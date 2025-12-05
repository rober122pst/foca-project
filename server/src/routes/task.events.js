import { createTask, deleteTask, updateTask } from '../controllers/tasks.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

// inicia o roteador e protege todas as rotas com autenticação
const router = express.Router();
router.use(authMiddleware);

// rotas responsáveis por criar, atualizar e deletar tarefas
router.post('/', createTask);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;