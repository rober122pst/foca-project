import { facebookAuth, googleAuth, login, logout, register } from './auth.controller.js';

import express from 'express';
import passport from 'passport';
import { refresh } from './refresh.controller.js';

// cria um roteador para agrupar as rotas de autenticação
const router = express.Router();

// rotas para: login de usuário, registrar novo usuário, renovar tokens jwt,logout do usuário
router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout)

// rota que inicia o login com google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// rota de callback do google após autenticação
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth`, session: false }), googleAuth);

// rota que inicia o login com facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// rota de callback do facebook após autenticação
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/auth`, session: false }), facebookAuth);

export default router;