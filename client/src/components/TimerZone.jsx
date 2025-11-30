import { motion } from 'framer-motion';

export default function TimerZone({
    mode,
    radius,
    circumference,
    timeLeft,
    sessionCount,
    formatTime,
    strokeDashoffset,
}) {
    return (
        <div className="relative flex flex-col items-center justify-center py-8">
            {/* Container Circular SVG */}
            <div className="relative flex h-80 w-80 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform">
                    {/* Círculo de fundo */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-items-900/70"
                    />
                    {/* Círculo de progresso animado */}
                    <motion.circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={false}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'linear' }}
                        strokeLinecap="round"
                        className={mode === 'focus' ? 'text-items-500' : 'text-accent-500'}
                    />
                </svg>

                {/* Conteúdo Central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={timeLeft} // Animação sutil a cada segundo
                        initial={{ opacity: 0.8, y: 1 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-cream-100 mb-2 text-7xl font-bold tracking-tight tabular-nums"
                    >
                        {formatTime(timeLeft)}
                    </motion.div>
                    <div className="text-items-700 text-lg font-medium tracking-widest uppercase">
                        {mode === 'focus' ? 'Foco Profundo' : 'Pausa Relax'}
                    </div>
                    <div className="bg-items-900/70 text-medium mt-4 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
                        <span className="bg-accent-500 h-2 w-2 rounded-full"></span>
                        Ciclo #{sessionCount}/8
                    </div>
                </div>
            </div>

            {/* Título da Tarefa Ativa */}
            <div className="mt-8 max-w-md text-center">
                <h2 className="text-cream-100 truncate text-xl font-semibold">Refatorar UI do Dashboard</h2>
                <p className="text-medium mt-1 text-sm">Projeto Freelance • UX Design</p>
            </div>
        </div>
    );
}
