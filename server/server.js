import './src/auth/passport.config.js';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import passport from 'passport';
import { Server } from 'socket.io';
import pomodoroSocketHandler from './src/socket/pomodoro.socket.js';
import routes from './src/routes/routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// inicialização do passport do Google e facebook
app.use(passport.initialize()); 

app.use((req, res, next) => {
    req.io = io; 
    next(); // Continua para a próxima etapa (as rotas)
});

app.use(routes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('Um utilizador conectou-se! ID:', socket.id);
    pomodoroSocketHandler(io, socket);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
