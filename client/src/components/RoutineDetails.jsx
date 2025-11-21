import { Calendar, CalendarCog, Check, Clock, Edit, Flame, Trash, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import Button from './ui/Button';
import { ProgressBar } from './ui/progress';

export default function RoutineDetails({ routine, onClose = () => {} }) {
    const getDayNames = (days) => {
        const dayMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        if (days.length === 7) return 'Todos os dias';
        return days.map((d) => dayMap[d]).join(', ');
    };

    const weekProgress = 75;

    return (
        <Card className="border-items-500 dark:border-items-500 border-2">
            <CardHeader>
                <CardTitle className="text-lg">
                    <CalendarCog className="text-items-500" />
                    Detalhes da Rotina
                </CardTitle>
                <Button variant="ghost" onClick={onClose} className="size-8">
                    <X className="size-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className={`size-12 rounded-lg ${routine.color} display-center text-cream-100`}>
                            <Clock className="size-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-items-500 text-xl font-bold">{routine.title}</h3>
                            <p className="text-medium mt-1 text-sm">{routine.description}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="text-accent-500 size-4" />
                        <span>
                            {routine.startTime} - {routine.endTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="text-accent-500 size-4" />
                        <span>{getDayNames(routine.days)}</span>
                    </div>
                    {routine.streak > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Flame className="text-accent-500 size-4" />
                            <span className="font-semibold">{routine.streak} dias de sequência</span>
                        </div>
                    )}

                    <div>
                        <span className="bg-cream-300 dark:bg-night-700 flex w-fit gap-1 rounded-md px-2 py-1 text-xs">
                            {routine.category}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-medium">Progresso semanal</span>
                            <span className="font-semibold">{weekProgress}%</span>
                        </div>
                        <ProgressBar color="bg-items-500" progress={weekProgress} className="h-2" />
                    </div>

                    {!routine.completed && (
                        <Button className="w-full">
                            <Check className="mr-2 size-4" />
                            Marcar como concluído
                        </Button>
                    )}

                    {routine.completed && (
                        <div className="rounded-lg bg-green-500/10 p-3 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            Concluído hoje
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex flex-1 items-center gap-2 bg-transparent dark:bg-transparent"
                        >
                            <Edit className="mr-1 size-4" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            className="text-items-500 dark:text-items-500 hover:bg-items-500 dark:hover:bg-items-500 hover:text-cream-100 hover:dark:text-cream-100 flex flex-1 items-center gap-2 bg-transparent dark:bg-transparent"
                        >
                            <Trash className="size-4" />
                            Excluir
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
