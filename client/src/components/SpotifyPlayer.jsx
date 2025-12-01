import { motion } from 'framer-motion';
import { ProgressBar } from './ui/progress';

export default function SpotifyPlayer() {
    const cdVariants = {
        initial: {
            borderRadius: '16px', // Levemente arredondado inicialmente para estética
            rotate: 0,
            scale: 1,
            boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
        },
        hover: {
            borderRadius: '50%',
            rotate: 360,
            scale: 0.95, // Diminui um pouco para caber melhor na "case" imaginária
            boxShadow: '0px 20px 50px rgba(0,0,0,0.4)',
            transition: {
                rotate: {
                    repeat: Infinity,
                    duration: 3, // Velocidade do giro (segundos)
                    ease: 'linear',
                    delay: 0.2, // Pequeno delay para começar a girar após virar bola
                },
                borderRadius: { duration: 0.4 },
                scale: { duration: 0.3 },
            },
        },
    };

    const holeVariants = {
        initial: {
            scale: 0,
            opacity: 0,
        },
        hover: {
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.1,
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
            },
        },
    };

    return (
        <div className="flex items-center gap-2">
            <motion.div
                whileHover="hover"
                initial="initial"
                animate="initial"
                variants={{ hover: {}, initial: {} }}
                className="relative size-28"
            >
                <motion.div
                    variants={cdVariants}
                    className="h-full w-full overflow-hidden rounded-xl border-4 border-neutral-800/50 bg-[url(https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4)] bg-cover"
                >
                    <motion.div
                        variants={{
                            initial: { opacity: 0 },
                            hover: { opacity: 0.3, transition: { duration: 0.5 } },
                        }}
                        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent"
                    />
                </motion.div>
                {/* O Furo do CD (Centro) */}
                <motion.div
                    variants={holeVariants}
                    className="absolute top-1/2 left-1/2 flex h-10 w-10 items-center justify-center rounded-full border-3 border-neutral-700/50 bg-neutral-800"
                    style={{ x: '-50%', y: '-50%' }} // Centralização absoluta
                >
                    {/* Furo interno vazado (simulado com a cor do fundo do player) */}
                    <div className="bg-items-950/80 h-4 w-4 rounded-full shadow-inner" />
                </motion.div>
            </motion.div>
            <div className="flex-1">
                <p className="leading-none font-bold">Cleanin' Out My Closet</p>
                <span className="text-medium truncate text-sm">Eminem</span>

                <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs">3:28</span>
                    <ProgressBar className="h-0.5" progress={70} />
                    <span className="text-xs">4:57</span>
                </div>
            </div>
        </div>
    );
}
