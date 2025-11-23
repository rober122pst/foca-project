import { AnimatePresence, motion } from 'motion/react';

import { twMerge } from 'tailwind-merge';

export function Modal({ children, className = '', isOpen = false, type = 'default', onClose }) {
    const handleBackgroundClick = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };
    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackgroundClick}
                    className="display-center absolute top-0 left-0 z-40 min-h-screen w-full bg-black/35"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={handleContentClick}
                        className={twMerge('bg-card border-border rounded-4xl border py-6', className)}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function ModalHeader({ children, className = '' }) {
    return <div className={twMerge('flex justify-between px-4', className)}>{children}</div>;
}

export function ModalTitle({ children, className = '' }) {
    return (
        <div className={twMerge('text-primary flex items-center gap-1.5 text-lg font-extrabold', className)}>
            {children}
        </div>
    );
}

export function ModalContent({ children, className = '' }) {
    return <div className={twMerge('text-primary flex flex-col gap-2', className)}>{children}</div>;
}
