import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
import { usePomodoroTimer } from '../hooks/usePomodoroTimer'; // O novo hook

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function PomodoroPage() {
    // 1. Dados e Conexão
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');
    const { user, isLoading } = useAuth();

    const { sessionData, startTimer, pauseTimer, resumeTimer, finishBlock, resetBlock, error } =
        usePomodoroSocket(sessionId);

    // 2. Lógica de UI/Carregamento
    const fakeProgress = useFakeProgress(isLoading && sessionData);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [blockerActive, setBlockerActive] = useState(true);
    const [isCycleComplete, setIsCycleComplete] = useState(false);
    const [prevCompletedBlocks, setPrevCompletedBlocks] = useState(0);

    const [currentEventData, setCurrentEventData] = useState(null);

    // 3. Lógica do Timer (Extraída para o Hook)
    const { timeLeft, totalTime, mode, isActive } = usePomodoroTimer(sessionData, finishBlock);

    // 4. Efeitos Secundários (UI)
    useEffect(() => {
        document.title = `${formatTime(timeLeft)} - Foca`;
    }, [timeLeft]);

    useEffect(() => {
        if ('Notification' in window) Notification.requestPermission();
    }, []);

    useEffect(() => {
        if (fakeProgress >= 100) setIsInitialLoad(false);
    }, [fakeProgress]);

    // Lógica de Celebração (Deteta mudança nos blocos completados)
    useEffect(() => {
        if (!sessionData) return;

        if (!currentEventData) {
            setCurrentEventData(sessionData.event);
        }

        const completed = sessionData.pomodoroBlocks.filter((b) => b.endTime && b.type === 'FOCUS').length;

        if (completed > prevCompletedBlocks || sessionData.status === 'COMPLETED') {
            setIsCycleComplete(true);
        }
        setPrevCompletedBlocks(completed);
    }, [sessionData, prevCompletedBlocks]);

    // 5. Funções de Controlo (Handlers)
    const toggleTimer = () => {
        setIsCycleComplete(false);
        if (isActive) {
            pauseTimer();
        } else {
            const hasStartedBlock = sessionData?.pomodoroBlocks.find((b) => b.startTime && !b.endTime);
            if (sessionData?.status === 'WAITING' || !hasStartedBlock) {
                startTimer();
            } else {
                resumeTimer();
            }
        }
    };

    const handleReset = () => {
        resetBlock();
        setIsCycleComplete(false);
    };

    // 6. Cálculos Visuais
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Derived Data
    const completedBlocksCount = sessionData?.pomodoroBlocks.filter((b) => b.endTime && b.type === 'FOCUS').length || 0;
    const totalFocusBlocks = sessionData?.pomodoroBlocks.filter((b) => b.type === 'FOCUS').length || 0;

    if (error) {
        return <div className="bg-items-950 flex h-screen items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <>
            <AnimatePresence>{isInitialLoad && <LoadingScreenPomodoro progress={fakeProgress} />}</AnimatePresence>

            {!isInitialLoad && (
                <div className="bg-items-950 text-cream-200 selection:bg-items-500/30 min-h-screen">
                    <CelebrationOverlay
                        isCycleComplete={isCycleComplete}
                        switchMode={() => {}} // Se houver lógica, insira aqui
                        toggleTimer={toggleTimer}
                        resetTimer={handleReset}
                    />

                    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-4">
                        <div className="relative flex h-full flex-col lg:col-span-3">
                            <HeaderZone
                                isActive={isActive}
                                mode={mode.toLowerCase()}
                                avatar={user.profile.picUrl}
                                level={user.profile.gamefication.level}
                                xp={user.profile.gamefication.xp}
                            />

                            <main className="flex flex-1 flex-col items-center justify-center pb-12">
                                <TimerZone
                                    mode={mode.toLowerCase()}
                                    radius={radius}
                                    circumference={circumference}
                                    timeLeft={timeLeft}
                                    sessionCount={completedBlocksCount + 1}
                                    totalCycles={totalFocusBlocks}
                                    formatTime={formatTime}
                                    strokeDashoffset={strokeDashoffset}
                                    eventData={currentEventData}
                                />
                                <ControlsZone
                                    resetTimer={handleReset}
                                    toggleTimer={toggleTimer}
                                    isActive={isActive}
                                    blockerActive={blockerActive}
                                    setBlockerActive={setBlockerActive}
                                />
                            </main>
                        </div>

                        <div className="col-span-1 h-full">
                            <ContextZone isActive={isActive} />
                        </div>
                    </div>

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
