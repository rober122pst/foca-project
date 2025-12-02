import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import avatarImg from '../assets/foxy.webp';

const HeaderZone = ({ isActive, mode, level, xp, avatar }) => (
    <motion.div animate={{ opacity: isActive ? 0.4 : 1 }} className="flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-4">
            {/* Avatar / Mascote */}
            <div className="relative">
                <motion.div
                    animate={{
                        scale: isActive ? [1, 1.05, 1] : 1,
                        borderColor: isActive ? '#ff0546' : '#45032799',
                    }}
                    transition={{
                        scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                        duration: 0.3,
                    }}
                    className="bg-items-900/50 border-items-900/50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 text-2xl"
                >
                    <img src={avatar || avatarImg} alt="Avatar" className="object-cover object-center" />
                </motion.div>
                {isActive && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="border-night-900 absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 bg-green-500"
                    />
                )}
            </div>

            {/* Barra de Level */}
            <div className="flex w-48 flex-col gap-1">
                <div className="text-cream-300 flex justify-between text-xs font-bold">
                    <span>Nível {level}</span>
                    <motion.span
                        key={xp}
                        initial={{ scale: 1.2, color: '#fdfdfd' }}
                        animate={{ scale: 1, color: '#9c173b' }}
                        className="text-purple-400"
                    >
                        {xp} XP
                    </motion.span>
                </div>
                <div className="bg-items-900/70 h-2 w-full overflow-hidden rounded-full">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(xp % 1000) / 10}%` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                        className="h-full bg-linear-to-r from-purple-500 to-blue-500"
                    />
                </div>
            </div>
        </div>

        {/* Micro-feedbacks */}
        <div className="text-cream-300 hidden items-center gap-2 text-sm md:flex">
            <Flame size={16} className="text-yellow-400" />
            <span>Sequência: 3 dias</span>
        </div>
    </motion.div>
);

export default HeaderZone;
