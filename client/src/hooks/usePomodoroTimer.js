import { useEffect, useRef, useState } from 'react';

import { notify } from '../utils/notify'; // Assumindo que este caminho existe

export function usePomodoroTimer(sessionData, finishBlock) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(25 * 60);
    const [mode, setMode] = useState('FOCUS');
    const [isActive, setIsActive] = useState(false);
    const isFinishingRef = useRef(false);
    const timerRef = useRef(null);

    // Lógica de Sincronização com o Servidor (Server Truth)
    useEffect(() => {
        if (!sessionData) return;

        // Encontra o bloco atual (o primeiro sem endTime ou o último existente)
        const currentBlock =
            sessionData.pomodoroBlocks.find((b) => !b.endTime) ||
            sessionData.pomodoroBlocks[sessionData.pomodoroBlocks.length - 1];

        if (currentBlock) {
            setMode(currentBlock.type);
            setTotalTime(currentBlock.plannedDuration);

            // Cenário 1: Timer a correr
            if (sessionData.status === 'RUNNING' && currentBlock.startTime) {
                setIsActive(true);
                const now = Date.now();
                const start = new Date(currentBlock.startTime).getTime();
                const totalPause = currentBlock.totalPauseTime * 1000;
                const elapsed = now - start - totalPause;
                const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(elapsed / 1000));
                setTimeLeft(remaining);
            }
            // Cenário 2: Pausado
            else if (sessionData.status === 'PAUSED') {
                setIsActive(false);
                if (currentBlock.startTime && currentBlock.lastPauseTime) {
                    const start = new Date(currentBlock.startTime).getTime();
                    const lastPause = new Date(currentBlock.lastPauseTime).getTime();
                    const totalPause = currentBlock.totalPauseTime * 1000;
                    const activeWork = lastPause - start - totalPause;
                    const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(activeWork / 1000));
                    setTimeLeft(remaining);
                } else if (!currentBlock.startTime) {
                    setTimeLeft(currentBlock.plannedDuration);
                }
            }
            // Cenário 3: À espera ou Completado
            else {
                setIsActive(false);
                setTimeLeft(sessionData.status === 'COMPLETED' ? 0 : currentBlock.plannedDuration);
            }
        }
    }, [sessionData]);

    // Lógica do Intervalo Local (Client Interpolation)
    useEffect(() => {
        if (isActive && sessionData) {
            timerRef.current = setInterval(() => {
                const currentBlock = sessionData.pomodoroBlocks.find((b) => !b.endTime);

                if (currentBlock && currentBlock.startTime) {
                    const now = Date.now();
                    const start = new Date(currentBlock.startTime).getTime();
                    const totalPause = currentBlock.totalPauseTime * 1000;
                    const elapsed = now - start - totalPause;
                    const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(elapsed / 1000));

                    if (remaining === 0 && !isFinishingRef.current) {
                        isFinishingRef.current = true;
                        clearInterval(timerRef.current);
                        setTimeLeft(0);

                        // Notificações
                        const title = mode === 'FOCUS' ? 'Pausa liberada! 🎉' : 'Hora de focar 💪';
                        const body =
                            mode === 'FOCUS'
                                ? 'Seu bloco de foco terminou. Bora respirar um pouco!'
                                : 'O descanso acabou. Partiu destruir mais uma tarefa!';
                        notify(title, body);
                        finishBlock(currentBlock.id);
                    } else if (remaining > 0) {
                        isFinishingRef.current = false;
                        setTimeLeft(remaining);
                    }
                }
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, sessionData, mode, finishBlock]);

    return { timeLeft, totalTime, mode, isActive };
}
