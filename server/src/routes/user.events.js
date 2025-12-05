import authMiddleware from '../auth/auth.middleware.js'
import express from 'express'

import { getMe } from '../controllers/user.controller.js'

// cria um roteador para agrupar as rotas de autenticação
const router = express.Router()
// rota que retorna informações do usuário autenticado
router.get('/me', authMiddleware, getMe)

export default router
