import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const SOCKET_URL = 'http://localhost:3000'; // Adjust as needed or use env

export function usePomodoroSocket(sessionId) {
    const [socket, setSocket] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('CONNECTING'); // CONNECTING, CONNECTED, DISCONNECTED

    useEffect(() => {
        if (!sessionId) return;

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        setStatus('CONNECTING');

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setStatus('CONNECTED');
            newSocket.emit('join_session', sessionId);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setStatus('DISCONNECTED');
        });

        newSocket.on('session_update', (data) => {
            console.log('Session update:', data);
            setSessionData(data);
        });

        newSocket.on('timer_started', (block) => {
            console.log('Timer started', block);
            // We might want to refresh full session or just update local state
            newSocket.emit('join_session', sessionId); // Force refresh for now
        });

        newSocket.on('timer_paused', () => {
            console.log('Timer paused');
            setSessionData((prev) => (prev ? { ...prev, status: 'PAUSED' } : null));
        });

        newSocket.on('timer_resumed', () => {
            // Usually followed by session_update, but ensure status
            setSessionData((prev) => (prev ? { ...prev, status: 'RUNNING' } : null));
        });

        newSocket.on('error', (err) => {
            console.error('Socket error:', err);
            setError(err.message);
        });

        newSocket.on('session_abandoned', () => {
            setError('Sessão abandonada/expirada');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [sessionId]);

    const startTimer = () => {
        if (socket) socket.emit('start_timer', { sessionId });
    };

    const pauseTimer = () => {
        if (socket) socket.emit('pause_timer', { sessionId });
    };

    const resumeTimer = () => {
        if (socket) socket.emit('resume_timer', { sessionId });
    };

    const finishBlock = (blockId) => {
        if (socket) socket.emit('finish_block', { sessionId, blockId });
    };

    return {
        socket,
        sessionData,
        error,
        status,
        startTimer,
        pauseTimer,
        resumeTimer,
        finishBlock,
    };
}
