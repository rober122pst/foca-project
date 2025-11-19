import { AnimatePresence, motion } from 'framer-motion';

import { ClockLoader } from 'react-spinners';

export default function LoadingScreen({ isLoading = true }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="bg-cream-100 dark:bg-night-950 fixed top-0 left-0 z-60 flex min-h-screen w-full flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ClockLoader color="#ff0546" size={80} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
