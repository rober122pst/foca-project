import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ShieldAlert } from 'lucide-react';
import CelebrationOverlay from '../components/CelebrationOverlay';
import ContextZone from '../components/ContextZone';
import ControlsZone from '../components/ControlsZone';
import HeaderZone from '../components/HeaderZone';
import LoadingScreen from '../components/LoadingScreen';
import TimerZone from '../components/TimerZone';
import { useAuth } from '../contexts/AuthContext';

const FOCUS_TIME = 10; // 25 minutes
const BREAK_TIME = 5; // 5 minutos

// --- COMPONENTE PRINCIPAL ---

export default function PomodoroPage() {
    const { user, isLoading } = useAuth();
    // Estado Mental e do Timer
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [sessionCount, setSessionCount] = useState(2); // Simulado como o "2º do dia"
    const [blockerActive, setBlockerActive] = useState(true);

    // Gamificação (XP e Nível)
    const [xp, setXp] = useState(1250);
    const [level, setLevel] = useState(5);

    // Estado da Conclusão
    const [isCycleComplete, setIsCycleComplete] = useState(false);

    // Referência para o intervalo
    const timerRef = useRef(null);

    // Formatação do tempo MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Cálculo do progresso circular
    const totalTime = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Efeito do Timer
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                // Micro-recompensa aleatória
                if (Math.random() > 0.95 && mode === 'focus') {
                    triggerMicroReward();
                }
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode]);

    const triggerMicroReward = () => {
        setXp((prev) => prev + 2);
    };

    const handleComplete = () => {
        setIsActive(false);
        clearInterval(timerRef.current);
        setIsCycleComplete(true);
        setXp((prev) => prev + 100);
        setSessionCount((prev) => prev + 1);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
        setIsCycleComplete(false);
    };

    const switchMode = () => {
        const newMode = mode === 'focus' ? 'break' : 'focus';
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
        setIsCycleComplete(false);
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading} />
            {!isLoading && (
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
