import { Calendar, CalendarCog, Check, Clock, Edit, Flame, Trash, X } from 'lucide-react';
import { useDeleteRoutine, usePatchRoutine } from '../hooks/routineHooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { motion } from 'motion/react';
import { rrulestr } from 'rrule';
import { useModalStore } from '../stores/useModalStore';
import { formatHours } from '../utils/formatTime';
import { getShortRecurrence } from '../utils/rrule-pt';
import Button from './ui/Button';
import { ProgressBar } from './ui/progress';

export default function RoutineDetails({ event, selectedDate, onClose = () => {} }) {
    const { mutate, isPending } = usePatchRoutine();
    const { mutate: deleteMutate, isPending: deletePending } = useDeleteRoutine();

    const { openModal } = useModalStore();

    const getRecurrenceText = (rruleString, dtstart) => {
        if (!rruleString)
            return new Date(dtstart)
                .toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })
                .split(' ')
                .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
                .join(' ');
        try {
            const rule = rrulestr(rruleString, { dtstart: new Date(dtstart) });

            return getShortRecurrence(rule);
        } catch (error) {
            console.error(error);
            return 'Recorrente';
        }
    };

    const isSelectedDateToday = new Date().toLocaleDateString('en-CA') === selectedDate?.toLocaleDateString('en-CA');

    const isCompletedToday = event.completed;

    return (
        event && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
            >
                <Card className="border-items-500 dark:border-items-500 border-2">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            <CalendarCog className="text-items-500" />
                            Detalhes do Evento
                        </CardTitle>
                        <Button variant="ghost" onClick={onClose} className="size-8">
                            <X className="size-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div
                                    className={'display-center text-cream-100 size-12 rounded-lg'}
                                    style={{ background: event.color }}
                                >
                                    <Clock className="size-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-items-500 text-xl font-bold">{event.title}</h3>
                                    <p className="text-medium mt-1 text-sm">{event.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="text-accent-500 size-4" />
                                <span>
                                    {formatHours(event.dtstart)} - {formatHours(event.dtend)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="text-accent-500 size-4" />
                                <span>{getRecurrenceText(event.rrule, event.dtstart)}</span>
                            </div>
                            {event.streak > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Flame className="text-accent-500 size-4" />
                                    <span className="font-semibold">{event.streak} dias de sequência</span>
                                </div>
                            )}

                            <div>
                                <span className="bg-cream-300 dark:bg-night-700 flex w-fit gap-1 rounded-md px-2 py-1 text-xs">
                                    {event.tag}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-medium">Progresso semanal</span>
                                    <span className="font-semibold">{event.rate || 0}%</span>
                                </div>
                                <ProgressBar color="bg-items-500" progress={event.rate || 0} className="h-2" />
                            </div>

                            {!isCompletedToday && isSelectedDateToday && (
                                <Button
                                    className="w-full"
                                    onClick={() =>
                                        mutate(
                                            {
                                                id: event.id,
                                                payload: {
                                                    occurrenceDate: selectedDate,
                                                },
                                            },
                                            {
                                                onSuccess: () => {
                                                    console.log('Evento completado');
                                                    onClose();
                                                },
                                            }
                                        )
                                    }
                                    disabled={isPending}
                                >
                                    <Check className="mr-2 size-4" />
                                    Marcar como concluído
                                </Button>
                            )}

                            {isCompletedToday && (
                                <div className="rounded-lg bg-green-500/10 p-3 text-center text-sm font-medium text-green-400">
                                    Concluído hoje
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex flex-1 items-center gap-2 bg-transparent dark:bg-transparent"
                                    disabled={deletePending}
                                    onClick={() =>
                                        openModal('edit-routine', {
                                            id: event.id,
                                            title: event.title,
                                            description: event.description,
                                            tag: event.tag,
                                            color: event.color,
                                            dtstart: formatHours(event.dtstart),
                                            dtend: formatHours(event.dtend),
                                            rrule: event.rrule,
                                        })
                                    }
                                >
                                    <Edit className="size-4" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-items-500 dark:text-items-500 hover:bg-items-500 dark:hover:bg-items-500 hover:text-cream-100 hover:dark:text-cream-100 flex flex-1 items-center gap-2 bg-transparent dark:bg-transparent"
                                    onClick={() => deleteMutate(event.id, { onSuccess: () => onClose() })}
                                >
                                    <Trash className="size-4" />
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    );
}
