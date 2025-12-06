import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { getProfile } from '../controllers/profile.controller.js';

// inicia o roteador e protege todas as rotas com autenticação
const router = express.Router();
router.use(authMiddleware);

// rota para buscar dados do perfil do usuário
router.get('/profile', getProfile);

export default router;
