import { CalendarRange, Clock, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function RoutinesList({ onSelectRoutine = () => {} }) {
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
        {
            id: '5',
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
