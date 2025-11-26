import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './src/auth/auth.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import geminiRoutes from './src/routes/gemini.routes.js';
import routineRoutes from './src/routes/routine.routes.js';
import userRoutes from './src/routes/user.routes.js';
import session from 'express-session';
import passport from 'passport';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// criando um session para login Google e Facebook
app.use(session({
  secret: process.env.SESSION_SECRET || 'precisa de uma chave secreta', 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    secure: false, 
    // aqui tem 24 horas de login
    maxAge: 1000 * 60 * 60 * 24
  }
}));
// inicialização do passport do Google e facebook
app.use(passport.initialize()); 
app.use(passport.session());



app.get('/', (req, res) => {
    res.send('Server is running');
});

// Usar rotas
app.use('/auth', authRoutes);
app.use('/user/routines', routineRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', geminiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
