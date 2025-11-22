import { CalendarRange, Clock, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function RoutinesList({ onSelectRoutine, routines = [] }) {
    const getDayNames = (days = []) => {
        const dayMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        if (days.length === 7) return 'Todos os dias';
        return days.map((d) => dayMap[d]).join(', ');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    <CalendarRange className="text-items-500" />
                    Todas as Rotinas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="scrollbar-custom h-full max-h-[445px] space-y-3 overflow-auto">
                    {routines.map((routine) => (
                        <button
                            key={routine.id}
                            onClick={() => onSelectRoutine(routine)}
                            className="border-border bg-card hover:bg-muted w-full cursor-pointer rounded-2xl border p-3 text-left transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`size-10 rounded-lg ${routine.color} display-center text-cream-100`}>
                                    <Clock className="size-5" />
                                </div>
                                <div className="">
                                    <h4 className="text-items-500 font-semibold">{routine.title}</h4>
                                    <p className="text-medium mt-1 text-xs">{getDayNames(routine.days)}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="bg-cream-300 dark:bg-night-700 flex w-fit gap-1 rounded-md px-2 py-1 text-xs">
                                            {routine.category}
                                        </span>
                                        {routine.streak > 0 && (
                                            <div className="text-accent-500 flex items-center gap-1 text-xs">
                                                <Flame className="size-3" />
                                                {routine.streak}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
