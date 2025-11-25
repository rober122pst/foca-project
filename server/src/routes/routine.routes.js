import { createRoutine, deleteRoutine, getRoutineById, getRoutines, updateRoutine } from '../controllers/routine.controller.js';

import express from 'express';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRoutine);

router.get('/:routineId', getRoutineById);
router.patch('/:routineId', updateRoutine);
router.delete('/:routineId', deleteRoutine)
router.get('/', getRoutines);

export default router;