import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Pause, Play, Square, Unlock } from 'lucide-react';

const ControlsZone = ({ resetTimer, toggleTimer, isActive, blockerActive, setBlockerActive }) => (
    <div className="mt-4 flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
            {/* Botão Secundário: Encerrar/Resetar */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="bg-items-900/70 hover:bg-items-900 text-cream-300 hover:text-cream-100 cursor-pointer rounded-full p-4"
                title="Reiniciar Ciclo"
            >
                <Square size={20} fill="currentColor" />
            </motion.button>

            {/* Botão Primário: Start/Pause */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                animate={{
                    backgroundColor: isActive ? '#45032799' : '#fdfdfd',
                    color: isActive ? '#fdfdfd' : '#17001d',
                }}
                className="cursor-pointer rounded-full p-6 shadow-lg shadow-purple-900/20"
            >
                <AnimatePresence mode="wait">
                    {isActive ? (
                        <motion.div
                            key="pause"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Pause size={32} fill="currentColor" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="play"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Play size={32} fill="currentColor" className="ml-1" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Bloqueador Toggle */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBlockerActive(!blockerActive)}
                animate={{
                    backgroundColor: blockerActive ? 'rgba(239, 68, 68, 0.1)' : '#45032799',
                    color: blockerActive ? '#f87171' : '#cdcdcd',
                    borderColor: blockerActive ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                }}
                className="cursor-pointer rounded-full border border-transparent p-4"
                title="Modo Bloqueio"
            >
                {blockerActive ? <Lock size={20} /> : <Unlock size={20} />}
            </motion.button>
        </div>
    </div>
);

export default ControlsZone;
