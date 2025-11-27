import { facebookAuth, googleAuth, login, logout, register } from './auth.controller.js';

import express from 'express';
import passport from 'passport';
import { refresh } from './refresh.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout)


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth`, session: false }), googleAuth);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/auth`, session: false }), facebookAuth);

export default router;