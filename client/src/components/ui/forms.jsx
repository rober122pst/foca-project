import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

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

export function TextArea({
    className = '',
    name = '',
    placeholder = '',
    onChange,
    value = '',
    autoComplete = 'on',
    rows = 5,
    cols = 40,
}) {
    return (
        <textarea
            className={twMerge(
                'text-md border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 focus:outline-items-500 w-full rounded-lg border-2 px-3 py-2 text-base font-normal ring-0 outline-transparent transition-colors duration-300 focus:outline-2',
                className
            )}
            value={value}
            rows={rows}
            cols={cols}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete={autoComplete}
        />
    );
}

export function TimePicker({ value, onChange, className = '' }) {
    const [open, setOpen] = useState(false);

    const time = [];

    for (let i = 0; i < 24 * 60; i += 30) {
        time.push({
            hours: String(Math.floor(i / 60)).padStart(2, '0'),
            minutes: String(i % 60).padStart(2, '0'),
        });
    }

    const handleSelect = (hour, minute) => {
        const newValue = `${hour}:${minute}`;
        onChange?.(newValue);
        setOpen(false);
    };

    return (
        <div className="relative inline-block w-full">
            {/* Campo */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={twMerge(
                    'border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 hover:border-items-500 w-full cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition',
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
                        <div className="scrollbar-custom max-h-40 flex-1 overflow-y-auto pr-1">
                            {time.map((t, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => handleSelect(t.hours, t.minutes)}
                                    className="hover:bg-card text-primary block w-full rounded-md px-2 py-1 text-left text-sm"
                                >
                                    {t.hours}:{t.minutes}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function DayPicker({ value, onChange, className = '' }) {
    const [currentMonth, setCurrentMonth] = useState(new Date(value));
    const selectedDate = new Date(value);
    const [isOpen, setIsOpen] = useState();

    const date = selectedDate;

    const dateString = date
        .toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: '2-digit',
        })
        .split(' ')
        .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join(' ');

    const MiniCalendar = () => {
        const monthNames = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
        ];
        const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

        // Pega os dias daquele mês
        const getDaysInMonth = (date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay(); // ex.: se dia 1 for segunda começa na segunda
            const prevMonthDays = new Date(year, month, 0).getDate(); // dias do mês anterior

            const days = []; // guarda do mês aqui
            for (let i = 0; i < startingDayOfWeek; i++) {
                const day = prevMonthDays - startingDayOfWeek + i + 1;

                days.push({
                    day,
                    type: 'prev', // indica que este dia é DO MÊS ANTERIOR
                });
            }
            for (let i = 1; i <= daysInMonth; i++) {
                // Guarda os dias
                days.push({
                    day: i,
                    type: 'current',
                });
            }

            const nextDaysNeeded = 42 - days.length;
            for (let i = 1; i <= nextDaysNeeded; i++) {
                days.push({
                    day: i,
                    type: 'next', // indica que pertence ao PRÓXIMO mês
                });
            }

            return days;
        };

        const days = getDaysInMonth(currentMonth);

        const goToPreviousMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        };

        const goToNextMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        };

        const isToday = (day) => {
            if (!day) return false;
            const today = new Date();
            return (
                day === today.getDate() && // Se o dia é o mesmo
                currentMonth.getMonth() === today.getMonth() && // Do mesmo mês
                currentMonth.getFullYear() === today.getFullYear() // Do mesmo ano
            );
        };

        const isSelected = (day) => {
            if (!day || !selectedDate) return false;

            return (
                day === selectedDate.getDate() &&
                currentMonth.getMonth() === selectedDate.getMonth() &&
                currentMonth.getFullYear() === selectedDate.getFullYear()
            );
        };

        return (
            <div className="bg-muted w-2xs px-4 py-1">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-sm">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h1>
                    <div className="flex">
                        <Button className="px-1 py-1" variant="ghost" onClick={goToPreviousMonth}>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="ghost" onClick={goToNextMonth}>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {dayNames.map((day, i) => (
                        <div key={i} className="text-medium p-2 text-center text-[10px] font-semibold">
                            {day}
                        </div>
                    ))}
                    {days.map((dayObj, index) => {
                        let addClass = '';

                        if (dayObj.type === 'current') {
                            if (isToday(dayObj.day)) {
                                addClass = 'bg-items-500/50';
                            } else {
                                if (isSelected(dayObj.day)) {
                                    addClass = 'bg-accent-500';
                                } else {
                                    addClass = 'hover:bg-card';
                                }
                            }
                        } else {
                            addClass = 'opacity-30';
                        }

                        return (
                            <button
                                disabled={dayObj.type !== 'current'}
                                key={index}
                                className={`aspect-square cursor-pointer rounded-full p-1.5 text-center align-middle text-[10px] transition-colors duration-300 disabled:cursor-default ${addClass}`}
                                type="button"
                                onClick={() => {
                                    const newDate = new Date(
                                        currentMonth.getFullYear(),
                                        currentMonth.getMonth(),
                                        dayObj.day
                                    );
                                    setIsOpen(false);
                                    onChange?.(newDate);
                                }}
                            >
                                {dayObj.day}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative inline-block w-full">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={twMerge(
                    'border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 hover:border-items-500 w-full cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition',
                    className
                )}
                onChange={onChange}
            >
                {dateString}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 160 }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-60 mt-2"
                    >
                        <MiniCalendar />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
