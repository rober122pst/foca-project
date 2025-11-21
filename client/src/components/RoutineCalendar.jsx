/* eslint-disable indent */

import { ChevronLeft, ChevronRight, CircleCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import Button from './ui/Button';

export default function RoutineCalendar({
    selectedDate = new Date(),
    onSelectDate = () => {},
    onSelectRoutine = () => {},
}) {
    const isResponsive = useResponsive(640);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const routines = [
        {
            id: '1',
            title: 'Estudar Matemática',
            description: 'Revisão de cálculo e exercícios',
            color: 'bg-blue-500',
            days: [3, 5],
            startTime: '09:00',
            endTime: '11:00',
            category: 'Estudos',
            completed: false,
            streak: 5,
        },
        {
            id: '6',
            title: 'Estudar pra portugues',
            description: 'Revisão',
            color: 'bg-blue-500',
            days: [3, 6],
            startTime: '09:00',
            endTime: '11:00',
            category: 'Estudos',
            completed: false,
            streak: 5,
        },
        {
            id: '2',
            title: 'Treino Físico',
            description: 'Academia e cardio',
            color: 'bg-orange-500',
            days: [1, 2, 4, 6],
            startTime: '07:00',
            endTime: '08:30',
            category: 'Saúde',
            completed: false,
            streak: 12,
        },
        {
            id: '3',
            title: 'Meditação',
            description: 'Mindfulness e respiração',
            color: 'bg-purple-500',
            days: [0, 1, 2, 3, 4, 5, 6],
            startTime: '06:00',
            endTime: '06:30',
            category: 'Bem-estar',
            completed: true,
            streak: 30,
        },
        {
            id: '4',
            title: 'Leitura',
            description: 'Ler 30 páginas por dia',
            color: 'bg-green-500',
            days: [0, 1, 2, 3, 4, 5, 6],
            startTime: '21:00',
            endTime: '22:00',
            category: 'Desenvolvimento',
            completed: false,
            streak: 8,
        },
    ];

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
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

    // Pega as rotinas correspodentes aquele dia
    const getRoutinesForDay = (dayOfWeek) => {
        return routines.filter((routine) => routine.days.includes(dayOfWeek));
    };

    const days = getDaysInMonth(currentMonth);

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    // Vê se é hoje
    const isToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() && // Se o dia é o mesmo
            currentMonth.getMonth() === today.getMonth() && // Do mesmo mês
            currentMonth.getFullYear() === today.getFullYear() // Do mesmo ano
        );
    };

    const selectedRoutinesForDay = selectedDate ? getRoutinesForDay(selectedDate.getDay()) : [];

    return (
        <div className="space-y-6">
            {/* Calendario */}
            <Card>
                <CardHeader>
                    <div className="flex flex-1 items-center justify-between">
                        <CardTitle className="text-lg">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </CardTitle>
                        <div className="flex gap-1">
                            <Button variant="outline" onClick={goToPreviousMonth}>
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button variant="outline" onClick={goToNextMonth}>
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {dayNames.map((day) => (
                            <div key={day} className="text-medium p-2 text-center text-xs font-semibold">
                                {day}
                            </div>
                        ))}
                        {days.map((day, index) => {
                            const dayOfWeek = index % 7;
                            const dayRoutines = day.day ? getRoutinesForDay(dayOfWeek) : [];
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const newDate = new Date(
                                            currentMonth.getFullYear(),
                                            currentMonth.getMonth(),
                                            day.day
                                        );
                                        onSelectDate(newDate);
                                    }}
                                    disabled={day.type !== 'current'}
                                    className={`relative flex min-h-[50px] flex-col items-start rounded-md border p-1 text-left transition-colors sm:min-h-20 sm:rounded-lg sm:p-2 ${
                                        day.type !== 'current'
                                            ? 'border-cream-200 dark:border-night-800 cursor-default opacity-30'
                                            : isToday(day.day)
                                              ? 'border-items-500 bg-items-700/10 cursor-pointer'
                                              : 'border-cream-200 dark:border-night-800 hover:bg-cream-200 dark:hover:bg-night-800 cursor-pointer'
                                    }`}
                                >
                                    <span
                                        className={`text-xs font-medium sm:text-sm ${isToday(day.day) && 'text-items-500'} `}
                                    >
                                        {day.day}
                                    </span>
                                    <div className="mt-1 flex w-full flex-col gap-0.5 sm:gap-1">
                                        {dayRoutines.slice(0, isResponsive ? 1 : 2).map((routine) => (
                                            <div
                                                key={routine.id}
                                                className={`h-0.5 w-full rounded-full sm:h-1 ${routine.color}`}
                                                title={routine.title}
                                            ></div>
                                        ))}
                                        {((isResponsive && dayRoutines.length > 1) ||
                                            (!isResponsive && dayRoutines.length > 2)) && (
                                            <span className="text-medium text-[10px]">
                                                +{dayRoutines.length - (isResponsive ? 1 : 2)}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Cronograma do dia */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                        <span className="hidden sm:inline">
                            Rotinas -{' '}
                            {selectedDate.toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </span>
                        <span className="sm:hidden">
                            {selectedDate.toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {selectedRoutinesForDay.length > 0 ? (
                        <div className="space-y-3">
                            {selectedRoutinesForDay.map((routine) => (
                                <button
                                    key={routine.id}
                                    onClick={() => onSelectRoutine(routine)}
                                    className="border-cream-200 dark:border-night-800 bg-card hover:bg-cream-200 dark:hover:bg-night-800 w-full rounded-lg border p-3 text-left transition-colors"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className={`h-12 w-1 rounded-full ${routine.color}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">{routine.title}</h4>
                                                {routine.completed && (
                                                    <span className="bg-cream-300 dark:bg-night-700 flex gap-1 rounded-md px-2 py-1 text-xs">
                                                        <CircleCheck className="size-4" />
                                                        Concluído
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-medium mt-1 truncate text-sm">{routine.description}</p>
                                            <div className="text-medium mt-2 flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {routine.startTime} - {routine.endTime}
                                                </div>
                                                <span className="border-cream-300 dark:border-night-700 text-primary flex gap-1 rounded-md border px-2 py-1 text-xs">
                                                    {routine.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-medium text-sm">Nenhuma rotina ou evento programado para este dia</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
