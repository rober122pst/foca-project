import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ShieldAlert } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CelebrationOverlay from '../components/CelebrationOverlay';
import ContextZone from '../components/ContextZone';
import ControlsZone from '../components/ControlsZone';
import HeaderZone from '../components/HeaderZone';
import LoadingScreenPomodoro from '../components/LoadingScreenPomodoro';
import TimerZone from '../components/TimerZone';
import { useAuth } from '../contexts/AuthContext';
import { useFakeProgress } from '../hooks/useFakeProgress';
import { usePomodoroSocket } from '../hooks/usePomodoroSocket';
import { notify } from '../utils/notify';

export default function PomodoroPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');

    const { user, isLoading } = useAuth();

    // Socket Hook
    const { sessionData, startTimer, pauseTimer, resumeTimer, finishBlock, resetBlock, error, status } =
        usePomodoroSocket(sessionId);

    const fakeProgress = useFakeProgress(isLoading && sessionData);

    // Local State for Interpolation
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(25 * 60);
    const [mode, setMode] = useState('FOCUS'); // 'FOCUS' | 'BREAK'
    const [isActive, setIsActive] = useState(false);

    // UI State
    const [blockerActive, setBlockerActive] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isCycleComplete, setIsCycleComplete] = useState(false);

    const [eventData, seteventData] = useState(null);

    const timerRef = useRef(null);

    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (fakeProgress >= 100) {
            setIsInitialLoad(false);
        }
    }, [fakeProgress]);

    // Sync with Server State
    useEffect(() => {
        if (!sessionData) return;

        if (!eventData) {
            seteventData(sessionData.event);
        }

        // Determine current block
        // The first block that is not finished (no endTime)
        const currentBlock =
            sessionData.pomodoroBlocks.find((b) => !b.endTime) ||
            sessionData.pomodoroBlocks[sessionData.pomodoroBlocks.length - 1];

        if (currentBlock) {
            setMode(currentBlock.type); // FOCUS or BREAK
            setTotalTime(currentBlock.plannedDuration);

            if (sessionData.status === 'RUNNING' && currentBlock.startTime) {
                setIsActive(true);

                // Calculate real remaining time
                const now = Date.now();
                const start = new Date(currentBlock.startTime).getTime();
                const totalPause = currentBlock.totalPauseTime * 1000;
                // Note: lastPauseTime is not needed if we are RUNNING (server clears it on resume)
                // But if we just disconnected and reconnected, it might be running.

                const elapsed = now - start - totalPause;
                const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(elapsed / 1000));

                setTimeLeft(remaining);
            } else if (sessionData.status === 'PAUSED') {
                setIsActive(false);
                // Calculate remaining time frozen at pause
                // To do this accurately, we need `lastPauseTime`.
                // However, the simplest way is: TimeLeft = Duration - (Active Work Time).
                // Active Work Time = (LastPause - Start - PreviousPauses)
                // But the server might not send `lastPauseTime` if it's null on resume.
                // Wait, if PAUSED, `lastPauseTime` is set.

                if (currentBlock.startTime && currentBlock.lastPauseTime) {
                    const start = new Date(currentBlock.startTime).getTime();
                    const lastPause = new Date(currentBlock.lastPauseTime).getTime();
                    const totalPause = currentBlock.totalPauseTime * 1000;

                    const activeWork = lastPause - start - totalPause;
                    const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(activeWork / 1000));
                    setTimeLeft(remaining);
                } else {
                    // Not started yet or some other state
                    if (!currentBlock.startTime) {
                        setTimeLeft(currentBlock.plannedDuration);
                    }
                }
            } else if (sessionData.status === 'WAITING' || !currentBlock.startTime) {
                setIsActive(false);
                setTimeLeft(currentBlock.plannedDuration);
            } else if (sessionData.status === 'COMPLETED') {
                setIsActive(false);
                setTimeLeft(0);
                setIsCycleComplete(true);
            }
        }
    }, [sessionData]);

    // Handle initial 0 case (reconnect when block finished but not closed)
    useEffect(() => {
        if (sessionData && timeLeft === 0 && isActive) {
            const currentBlock = sessionData.pomodoroBlocks.find((b) => !b.endTime);
            if (currentBlock && currentBlock.startTime) {
                finishBlock(currentBlock.id);
            }
        }
    }, [timeLeft, isActive, sessionData]);

    // Celebration Overlay Trigger
    const [prevCompletedBlocks, setPrevCompletedBlocks] = useState(0);

    useEffect(() => {
        if (!sessionData) return;
        const completed = sessionData.pomodoroBlocks.filter((b) => b.endTime && b.type === 'FOCUS').length;

        // If completed blocks increased, show celebration
        if (completed > prevCompletedBlocks) {
            setIsCycleComplete(true);
        }

        // Also if status is COMPLETED (final block)
        if (sessionData.status === 'COMPLETED') {
            setIsCycleComplete(true);
        }

        setPrevCompletedBlocks(completed);
    }, [sessionData]);

    // Local Timer Interpolation
    useEffect(() => {
        // We only start the interval if we are active, and we have session data.
        // We do NOT depend on timeLeft > 0 to start it, because it might be 0 but pending server completion.
        if (isActive && sessionData) {
            timerRef.current = setInterval(() => {
                const currentBlock = sessionData.pomodoroBlocks.find((b) => !b.endTime);
                if (currentBlock && currentBlock.startTime) {
                    const now = Date.now();
                    const start = new Date(currentBlock.startTime).getTime();
                    const totalPause = currentBlock.totalPauseTime * 1000;
                    const elapsed = now - start - totalPause;
                    const remaining = Math.max(0, currentBlock.plannedDuration - Math.floor(elapsed / 1000));

                    // Only update state if it changed significantly or hit 0
                    setTimeLeft((prev) => {
                        if (remaining === 0 && prev !== 0) {
                            clearInterval(timerRef.current);
                            notify(
                                mode === 'FOCUS' ? 'Pausa liberada! 🎉' : 'Hora de focar 💪',
                                mode === 'FOCUS'
                                    ? 'Seu bloco de foco terminou. Bora respirar um pouco!'
                                    : 'O descanso acabou. Partiu destruir mais uma tarefa!'
                            );
                            finishBlock(currentBlock.id);
                            return 0;
                        }
                        return remaining;
                    });
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, sessionData]);

    // Formatação do tempo MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Cálculo do progresso circular
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const toggleTimer = () => {
        if (isActive) {
            pauseTimer();
        } else {
            if (
                sessionData?.status === 'WAITING' ||
                !sessionData?.pomodoroBlocks.find((b) => b.startTime && !b.endTime)
            ) {
                startTimer();
            } else {
                resumeTimer();
            }
        }
        setIsCycleComplete(false);
    };

    const resetTimer = () => {
        resetBlock();
        setIsActive(false);
        setIsCycleComplete(false);
    };

    // Derived session count
    const completedBlocks = sessionData?.pomodoroBlocks.filter((b) => b.endTime && b.type === 'FOCUS').length || 0;
    const totalFocusBlocks = sessionData?.pomodoroBlocks.filter((b) => b.type === 'FOCUS').length || 0;

    if (error) {
        return <div className="bg-items-950 flex h-screen items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <>
            <AnimatePresence>{isInitialLoad && <LoadingScreenPomodoro progress={fakeProgress} />}</AnimatePresence>
            {!isInitialLoad && (
                <div className="bg-items-950 text-cream-200 selection:bg-items-500/30 min-h-screen">
                    {/* Overlay de Conclusão */}
                    <CelebrationOverlay
                        isCycleComplete={isCycleComplete}
                        switchMode={() => {}}
                        toggleTimer={toggleTimer}
                        resetTimer={resetTimer}
                    />
                    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-4">
                        {/* ZONA PRINCIPAL (A, B, C) */}
                        <div className="relative flex h-full flex-col lg:col-span-3">
                            {/* Zona C (Topo) */}
                            <HeaderZone
                                isActive={isActive}
                                mode={mode.toLowerCase()}
                                avatar={user.profile.picUrl}
                                level={user.profile.gamefication.level}
                                xp={user.profile.gamefication.xp}
                            />

                            {/* Centro (Zona A + B) */}
                            <main className="flex flex-1 flex-col items-center justify-center pb-12">
                                <TimerZone
                                    mode={mode.toLowerCase()}
                                    radius={radius}
                                    circumference={circumference}
                                    timeLeft={timeLeft}
                                    sessionCount={completedBlocks + 1}
                                    totalCycles={totalFocusBlocks}
                                    formatTime={formatTime}
                                    strokeDashoffset={strokeDashoffset}
                                    eventData={eventData}
                                />
                                <ControlsZone
                                    resetTimer={resetTimer}
                                    toggleTimer={toggleTimer}
                                    isActive={isActive}
                                    blockerActive={blockerActive}
                                    setBlockerActive={setBlockerActive}
                                />
                            </main>
                        </div>
                        {/* ZONA D (Lateral Direita) */}
                        <div className="col-span-1 h-full">
                            <ContextZone isActive={isActive} />
                        </div>
                    </div>

                    {/* Simulador de Notificação de Tentação */}
                    <AnimatePresence>
                        {isActive && blockerActive && (
                            <motion.div
                                initial={{ y: 100, opacity: 0, x: '-50%' }}
                                animate={{ y: 0, opacity: 1, x: '-50%' }}
                                exit={{ y: 100, opacity: 0, x: '-50%' }}
                                className="text-cream-100 fixed bottom-4 left-1/2 flex cursor-pointer items-center gap-3 rounded-full bg-red-500/90 px-6 py-3 shadow-xl hover:bg-red-600"
                            >
                                <ShieldAlert size={18} />
                                <span className="text-sm font-semibold">Bloqueio ativado</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
}
