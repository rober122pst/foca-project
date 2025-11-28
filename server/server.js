import './src/auth/passport.config.js';

import authRoutes from './src/auth/auth.routes.js';
import cors from 'cors';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import dotenv from 'dotenv';
import eventRoutes from './src/routes/event.routes.js';
import express from 'express';
import geminiRoutes from './src/routes/gemini.routes.js';
import passport from 'passport';
import taskRoutes from './src/routes/task.routes.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// inicialização do passport do Google e facebook
app.use(passport.initialize()); 



app.get('/', (req, res) => {
    res.send('Server is running');
});

// Usar rotas
app.use('/auth', authRoutes);
app.use('/user/events', eventRoutes);
app.use('/user/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', geminiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
