import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';
import { geminiCreateRoutine } from '../controllers/gemini.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/gemini-routine', geminiCreateRoutine)

export default router;