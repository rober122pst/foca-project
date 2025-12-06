import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../controllers/event.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import express from 'express';

// cria um roteador para agrupar as rotas de autenticação
const router = express.Router();

// verifica autenticação antes de acessar as rotas
router.use(authMiddleware);

// rotas de criação e listagem de eventos
router.post('/', createEvent);
router.get('/', getEvents);

// rotas que manipulam um evento específico
router.get('/:eventId', getEventById);
router.patch('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent)

export default router;