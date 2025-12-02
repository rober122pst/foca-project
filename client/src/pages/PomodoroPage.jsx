import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePomodoroSession, useStartPomodoro } from '../hooks/pomodoroHooks';

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

export default function PomodoroPage() {
    const [searchParams] = useSearchParams();

    const { user, isLoading } = useAuth();
    // Estado Mental e do Timer
    const [focusTime, setFocusTime] = useState(null);
    const breakTime = 5 * 60;
    const [timeLeft, setTimeLeft] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [sessionCount, setSessionCount] = useState(2); // Simulado como o "2º do dia"
    const [blockerActive, setBlockerActive] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Estado da Conclusão
    const [isCycleComplete, setIsCycleComplete] = useState(false);

    // Referência para o intervalo
    const timerRef = useRef(null);

    const sessionId = searchParams.get('session');

    const { data: pomodoro, isLoading: pomodoroLoading } = usePomodoroSession(sessionId);
    const { refetch } = useStartPomodoro(sessionId);

    const fakeProgress = useFakeProgress(isLoading && pomodoroLoading);

    // Formatação do tempo MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (pomodoro) {
            setFocusTime(pomodoro.pomodoroBlocks[0].plannedDuration);
            setTimeLeft(pomodoro.pomodoroBlocks[0].plannedDuration);
        }
    }, [pomodoro]);

    // Cálculo do progresso circular
    const totalTime = mode === 'focus' ? focusTime : breakTime;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Efeito do Timer
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode]);

    useEffect(() => {
        if (fakeProgress >= 100) {
            setIsInitialLoad(false);
        }
    }, [fakeProgress]);

    const handleComplete = () => {
        setIsActive(false);
        clearInterval(timerRef.current);
        setIsCycleComplete(true);
        setSessionCount((prev) => prev + 1);
    };

    const toggleTimer = () => {
        refetch();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? focusTime : breakTime);
        setIsCycleComplete(false);
    };

    const switchMode = () => {
        const newMode = mode === 'focus' ? 'break' : 'focus';
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? focusTime : breakTime);
        setIsCycleComplete(false);
    };

    return (
        <>
            <AnimatePresence>{isInitialLoad && <LoadingScreenPomodoro progress={fakeProgress} />}</AnimatePresence>
            {!isInitialLoad && (
                <div className="bg-items-950 text-cream-200 selection:bg-items-500/30 min-h-screen">
                    {/* Overlay de Conclusão */}
                    <CelebrationOverlay
                        isCycleComplete={isCycleComplete}
                        switchMode={switchMode}
                        toggleTimer={toggleTimer}
                        resetTimer={resetTimer}
                    />
                    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-4">
                        {/* ZONA PRINCIPAL (A, B, C) */}
                        <div className="relative flex h-full flex-col lg:col-span-3">
                            {/* Zona C (Topo) */}
                            <HeaderZone
                                isActive={isActive}
                                mode={mode}
                                avatar={user.profile.picUrl}
                                level={user.profile.gamefication.level}
                                xp={user.profile.gamefication.xp}
                            />

                            {/* Centro (Zona A + B) */}
                            <main className="flex flex-1 flex-col items-center justify-center pb-12">
                                <TimerZone
                                    mode={mode}
                                    radius={radius}
                                    circumference={circumference}
                                    timeLeft={timeLeft}
                                    sessionCount={sessionCount}
                                    formatTime={formatTime}
                                    strokeDashoffset={strokeDashoffset}
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
