import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';

export function Modal({ children, className = '', onClose }) {
    // Referência para guardar onde o clique começou
    const mouseDownTarget = useRef(null);

    // Guarda o elemento onde o botão do rato foi pressionado
    const handleMouseDown = (e) => {
        mouseDownTarget.current = e.target;
    };

    // Só fecha se o clique começou E terminou no background
    const handleBackgroundClick = (e) => {
        if (mouseDownTarget.current === e.currentTarget) {
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={handleMouseDown}
            onClick={handleBackgroundClick}
            className="display-center fixed inset-0 z-40 bg-black/50 py-0 sm:py-8"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className={twMerge('bg-card border-border h-fit h-full rounded-4xl border py-6', className)}
            >
                {children}
            </motion.div>
        </motion.div>
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
