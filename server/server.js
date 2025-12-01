import './src/auth/passport.config.js';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import authRoutes from './src/auth/auth.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import geminiRoutes from './src/routes/gemini.routes.js';
import pomodoroRoutes from './src/routes/pomodoro.routes.js';
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
app.use('/user/pomodoro', pomodoroRoutes)
app.use('/user/events', eventRoutes);
app.use('/user/tasks', taskRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ai', geminiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
