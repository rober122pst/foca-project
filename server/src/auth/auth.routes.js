import { login, register } from './auth.controller.js';

import express from 'express';
import { refresh } from './refresh.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh)

export default router;
