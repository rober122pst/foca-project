import { AnimatePresence, motion } from 'framer-motion';
import { Check, Coffee, List, Zap } from 'lucide-react';

import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import SpotifyPlayer from './SpotifyPlayer';
import { ProgressBar } from './ui/progress';

const ContextZone = ({ isActive }) => {
    const isResponsive = useResponsive(1024);
    // Estado local para gerenciar a checklist visualmente
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Criar grid no Figma', done: true },
        { id: 2, text: 'Definir paleta de cores', done: true },
        { id: 3, text: 'Implementar React Timer', done: false },
        { id: 4, text: 'Testar responsividade', done: false },
        { id: 5, text: 'Deploy na Vercel', done: false },
    ]);
    const [showAll, setShowAll] = useState(false);

    // Encontra a primeira tarefa não concluída
    const activeTask = tasks.find((t) => !t.done);

    const toggleTask = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };
    return (
        <motion.div
            animate={{
                opacity: isActive ? 0.1 : 1,
                filter: isActive ? 'blur(4px)' : 'blur(0px)',
                pointerEvents: isActive ? 'none' : 'auto',
            }}
            transition={{ duration: 0.5 }}
            className="bg-items-950 flex h-full flex-col gap-6 overflow-hidden p-6"
        >
            {!isResponsive && <SpotifyPlayer />}
            {/* Bloco Superior: Estatísticas e Ambiente */}
            <div className="space-y-4">
                <div className="bg-accent-500/10 rounded-xl p-4">
                    <div className="text-accent-500 mb-1 flex items-center gap-2">
                        <Coffee size={16} />
                        <span className="text-xs font-bold uppercase">Próxima Pausa</span>
                    </div>
                    <p className="text-cream-100 text-lg">05:00 min</p>
                </div>
                <div className="bg-accent-500/10 rounded-xl p-4">
                    <div className="text-accent-500 mb-1 flex items-center gap-2">
                        <Zap size={16} />
                        <span className="text-xs font-bold uppercase">Meta do dia</span>
                    </div>
                    <p className="text-sm text-slate-400">2/8 Pomodoros</p>
                    <ProgressBar color="bg-accent-500" className="mt-1" progress={25} />
                </div>
            </div>

            {/* Bloco Inferior: Checklist Interativa */}
            <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase">
                        {showAll ? 'Todas as Etapas' : 'Foco Atual'}
                    </h3>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-accent-600 hover:text-accent-500 flex items-center gap-1 text-xs transition-colors"
                    >
                        <List size={14} />
                        {showAll ? 'Ocultar' : 'Ver todas'}
                    </button>
                </div>
                <div className="relative min-h-20">
                    <AnimatePresence mode="popLayout">
                        {showAll ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2"
                            >
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="border-accent-500/20 bg-accent-500/10 hover:bg-accent-500 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${task.done ? 'bg-accent-500 border-accent-600' : 'hover:border-accent-500 border-accent-600'}`}
                                        >
                                            {task.done && <Check size={14} className="text-cream-100" />}
                                        </button>
                                        <span
                                            className={`text-sm ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                                        >
                                            {task.text}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        ) : activeTask ? (
                            <motion.div
                                key={activeTask.id}
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -50, opacity: 0, scale: 0.9, zIndex: -1 }}
                                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                className="absolute bottom-0 w-full"
                            >
                                <div className="group border-accent-500 bg-accent-500/10 flex items-center gap-4 rounded-r-xl border-l-4 p-4 shadow-lg">
                                    <button
                                        onClick={() => toggleTask(activeTask.id)}
                                        className="group-hover:border-items-500 border-accent-600 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors"
                                        title="Concluir etapa"
                                    >
                                        <div className="bg-items-500 h-3 w-3 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
                                    </button>
                                    <div className="flex flex-col">
                                        <span className="mb-0.5 text-xs font-bold text-slate-500 uppercase">
                                            Etapa Atual
                                        </span>
                                        <span className="text-cream-100 leading-tight font-medium">
                                            {activeTask.text}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center"
                            >
                                <span className="text-sm font-bold text-green-400">Todas as etapas concluídas! 🎉</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ContextZone;
