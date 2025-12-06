import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_API_URL;

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

        // We rely on session_update for these now, except paused which is useful for immediate feedback
        newSocket.on('timer_paused', () => {
            console.log('Timer paused');
            setSessionData((prev) => (prev ? { ...prev, status: 'PAUSED' } : null));
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

    const resetBlock = () => {
        if (socket) socket.emit('reset_block', { sessionId });
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
        resetBlock,
    };
}
