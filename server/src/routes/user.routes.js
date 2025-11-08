import authMiddleware from '../auth/auth.middleware.js'
import express from 'express'

import { getMe } from '../controllers/user.controller.js'
const router = express.Router()

router.get('/me', authMiddleware, getMe)

export default router
