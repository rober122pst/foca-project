import { AnimatePresence, motion } from 'framer-motion';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function Label({ children, className = '' }) {
    return (
        <label className={twMerge('text-md relative flex flex-col gap-0.5 font-semibold', className)}>{children}</label>
    );
}

export function InputText({
    className = '',
    type = 'text',
    name = '',
    placeholder = '',
    onChange,
    value = '',
    autoComplete = 'on',
}) {
    return (
        <input
            className={twMerge(
                'text-md border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 focus:outline-items-500 w-full rounded-lg border-2 px-3 py-2 text-base font-normal ring-0 outline-transparent transition-colors duration-300 focus:outline-2',
                className
            )}
            value={value}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete={autoComplete}
        />
    );
}

export default function TimePicker({ value, onChange, className = '' }) {
    const [open, setOpen] = useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    const handleSelect = (hour, minute) => {
        const newValue = `${hour}:${minute}`;
        onChange?.(newValue);
        setOpen(false);
    };

    return (
        <div className="relative inline-block">
            {/* Campo */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={twMerge(
                    'border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 hover:border-items-500 w-full cursor-pointer rounded-lg border-2 px-3 py-2 text-left transition',
                    className
                )}
            >
                {value || '00:00'}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 160 }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="border-border bg-muted absolute z-50 mt-2 flex w-full gap-2 rounded-2xl border p-3 shadow-xl"
                    >
                        {/* Horas */}
                        <div className="scrollbar-custom max-h-40 flex-1 overflow-y-auto pr-1">
                            {hours.map((h) => (
                                <button
                                    type="button"
                                    key={h}
                                    onClick={() => handleSelect(h, value?.split(':')[1] || '00')}
                                    className="hover:bg-card text-primary block w-full rounded-md px-2 py-1 text-left"
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        {/* Minutos */}
                        <div className="scrollbar-custom max-h-40 flex-1 overflow-y-auto">
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleSelect(value?.split(':')[0] || '00', m)}
                                    className="hover:bg-card text-primary block w-full rounded-md px-2 py-1 text-left"
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
