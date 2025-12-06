import { getEventsData, getOverviewData } from '../controllers/dashboard.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import express from 'express';

// cria um roteador para agrupar as rotas de autenticação
const router = express.Router();

// verifica autenticação antes de acessar as rotas
router.use(authMiddleware);

// rotas de leitura de dados do dashboard
router.get('/overview', getOverviewData);
router.get('/routines', getEventsData);

export default router;
