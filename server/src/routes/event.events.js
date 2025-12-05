import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../controllers/event.controller.js';

import authMiddleware from '../auth/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createEvent);

router.get('/:eventId', getEventById);
router.patch('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent)
router.get('/', getEvents);

export default router;