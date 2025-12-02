import { motion } from 'framer-motion';

const LoadingScreenPomodoro = ({ progress }) => (
    <motion.div
        className="bg-items-950 fixed inset-0 z-50 flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="relative">
            {/* Círculos pulsantes de fundo */}
            <motion.div
                className="bg-accent-500/20 absolute inset-0 rounded-full blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Mascote Carregando */}
            <motion.div
                className="relative z-10 flex h-24 w-24 items-center justify-center text-5xl"
                animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.08, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ backgroundImage: 'url(src/assets/logos/foca_logo_uncolor.svg)' }}
            />
        </div>

        {/* Texto de Loading */}
        <div className="mt-8 flex flex-col items-center gap-2">
            <motion.h2
                className="text-cream-100 text-xl font-bold tracking-widest uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Carregando Foco...
            </motion.h2>

            {/* Barra de Progresso Fake */}
            <div className="bg-items-900 mt-2 h-1.5 w-48 overflow-hidden rounded-full">
                <motion.div
                    className="bg-accent-500 h-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeInOut' }}
                />
            </div>
        </div>
    </motion.div>
);

export default LoadingScreenPomodoro;
