/* eslint-disable indent */

import { CalendarCheck2, CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useState } from 'react';
import { rrulestr } from 'rrule';
import { useResponsive } from '../hooks/useResponsive.js';
import { formatHours } from '../utils/formatTime.js';
import RoutineDailyListEmpty from './empty-states/RoutineDailyListEmpty.jsx';
import Button from './ui/Button';

export default function RoutineCalendar({ selectedDate, onSelectDate, onSelectEvent, events = [] }) {
    const isResponsive = useResponsive(640);
    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const isEventOnDate = (event, targetDate) => {
        try {
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);

            const dtStart = new Date(event.dtstart);

            if (!event.rrule) {
                return dtStart >= startOfDay && dtStart <= endOfDay;
            }

            const rule = rrulestr(event.rrule, {
                dtstart: dtStart,
            });

            const occurences = rule.between(startOfDay, endOfDay, true);

            return occurences.length > 0;
        } catch (error) {
            console.error(`Error ao processar regra do evento ${event.title}:`, error);
            return false;
        }
    };

    // Pega as rotinas correspodentes aquele dia
    const getEventsForDay = (calendarDay, type) => {
        if (!events || type !== 'current') return [];

        const targetDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), calendarDay);

        return events.filter((event) => isEventOnDate(event, targetDate));
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

    const isSelected = (day) => {
        if (!day || !selectedDate) return false;

        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        );
    };

    const selectedEventsForDay = selectedDate ? events.filter((event) => isEventOnDate(event, selectedDate)) : [];

    return (
        <div className="w-full space-y-6">
            {/* Calendario */}
            <Card>
                <CardHeader>
                    <div className="flex flex-1 items-center justify-between">
                        <CardTitle className="text-lg">
                            <CalendarDays className="text-items-500" />
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
                            const dayEvents = getEventsForDay(day.day, day.type);

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
                                    className={`relative flex min-h-[50px] flex-col items-start rounded-md border-2 p-1 text-left transition-colors sm:min-h-20 sm:rounded-lg sm:p-2 ${
                                        day.type !== 'current'
                                            ? 'border-border cursor-default opacity-30'
                                            : isToday(day.day)
                                              ? 'border-items-500 bg-items-700/10 cursor-pointer'
                                              : isSelected(day.day)
                                                ? 'border-accent-500 hover:bg-muted cursor-pointer'
                                                : 'border-border hover:bg-muted cursor-pointer'
                                    }`}
                                >
                                    <span
                                        className={`text-xs font-medium sm:text-sm ${isToday(day.day) && 'text-items-500'} `}
                                    >
                                        {day.day}
                                    </span>
                                    <div className="mt-1 flex w-full flex-col gap-0.5 sm:gap-1">
                                        {dayEvents.slice(0, isResponsive ? 1 : 2).map((routine) => (
                                            <div
                                                key={routine.id}
                                                className={'h-0.5 w-full rounded-full sm:h-1'}
                                                style={{ background: routine.color }}
                                                title={routine.title}
                                            ></div>
                                        ))}
                                        {((isResponsive && dayEvents.length > 1) ||
                                            (!isResponsive && dayEvents.length > 2)) && (
                                            <span
                                                title={dayEvents
                                                    .slice(isResponsive ? 1 : 2)
                                                    .map((routine) => routine.title)
                                                    .join('\n')}
                                                className="text-medium text-[10px]"
                                            >
                                                +{dayEvents.length - (isResponsive ? 1 : 2)}
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
                        <CalendarCheck2 className="text-items-500" />
                        <span className="hidden sm:inline">
                            Eventos -{' '}
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
                    {selectedEventsForDay.length > 0 ? (
                        <div className="scrollbar-custom h-full max-h-[350px] space-y-3 overflow-y-auto p-2">
                            {selectedEventsForDay.map((event) => {
                                const formatSelectedDate = selectedDate.toLocaleDateString('en-CA');
                                const completedToday = event.eventCompletions
                                    ? event.eventCompletions.some(
                                          (completion) =>
                                              new Date(completion.occurrenceDate).toLocaleDateString('en-CA') ===
                                              formatSelectedDate
                                      )
                                    : false;
                                return (
                                    <button
                                        key={event.id}
                                        onClick={() => onSelectEvent(event)}
                                        className="border-border bg-card hover:bg-muted w-full cursor-pointer rounded-2xl border p-3 text-left transition-colors"
                                    >
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div
                                                className={'h-10 w-1 rounded-full sm:h-12'}
                                                style={{ background: event.color }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold sm:text-base">
                                                        {event.title}
                                                    </h4>
                                                    {completedToday && (
                                                        <span className="flex gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs text-green-400">
                                                            <CircleCheck className="size-4" />
                                                            Concluído
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-medium mt-1 text-xs sm:text-sm">
                                                    {event.description}
                                                </p>
                                                <div className="text-items-500 mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatHours(event.dtstart)} - {formatHours(event.dtend)}
                                                    </div>
                                                    <span className="border-cream-300 dark:border-night-700 text-primary flex w-fit gap-1 rounded-md border px-2 py-1 text-xs">
                                                        {event.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <RoutineDailyListEmpty />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
