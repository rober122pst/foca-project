import { createPomodoroSession, getPomodoroSession } from '../controllers/pomodoro.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

// cria um roteador para agrupar as rotas de autenticação
const router = express.Router();

// verifica autenticação antes de acessar as rotas
router.use(authMiddleware);

// rotas de criação e consulta de sessões de pomodoro
router.post('/', createPomodoroSession);
router.get('/:id', getPomodoroSession);

export default router;