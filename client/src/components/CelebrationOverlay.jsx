import { AnimatePresence, motion } from 'framer-motion';

import { Coffee } from 'lucide-react';

const CelebrationOverlay = ({ isCycleComplete, switchMode, toggleTimer, resetTimer }) => (
    <AnimatePresence>
        {isCycleComplete && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-items-950/95 absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center backdrop-blur-md"
            >
                <div className="space-y-6 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="text-6xl"
                    >
                        🎉
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-cream-100 text-3xl font-bold"
                    >
                        Ciclo Completo!
                    </motion.h2>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-accent-500 text-xl font-bold">+100 XP</span>
                        <div className="text-cream-200">Tarefa: "Refatorar UI do Dashboard"</div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                switchMode();
                                toggleTimer();
                            }}
                            className="text-items-900 bg-cream-100 hover:bg-cream-200 flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 font-bold"
                        >
                            <Coffee size={20} />
                            Iniciar Pausa
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetTimer}
                            className="bg-items-900/70 hover:bg-items-900 text-cream-100 cursor-pointer rounded-full px-8 py-3 font-bold"
                        >
                            Fechar
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default CelebrationOverlay;
