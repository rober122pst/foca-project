import { Calendar, Check, Flame, Timer } from 'lucide-react';
import { Card, CardContent } from './ui/card';

import { formatMinutesToHourString } from '../../utils/formatTime';

export default function StatsOverview({ userStats }) {
    const stats = [
        { icon: Flame, label: 'Sequência', value: `${userStats.streak} ${userStats.streak === 1 ? 'dia' : 'dias'}` },
        { icon: Timer, label: 'Tempo em foco', value: `${formatMinutesToHourString(userStats.totalTimeFocused)}` },
        {
            icon: Check,
            label: 'Tarefas concluídas',
            value: `${userStats.completedTasks} ${userStats.completedTasks === 1 ? 'tarefa' : 'tarefas'}`,
        },
        {
            icon: Calendar,
            label: 'Rotinas ativas',
            value: `${userStats.activeRoutines} ${userStats.activeRoutines === 1 ? 'rotina' : 'rotinas'}`,
        },
    ];

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-4 py-2">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p className="text-items-950/70 dark:text-cream-100/30 text-xs font-semibold">
                                    {stat.label}
                                </p>
                                <p className="text-items-500 text-xl font-bold xl:text-2xl">{stat.value}</p>
                            </div>
                            <div className="bg-items-500/20 rounded-xl p-3">
                                <stat.icon className="text-items-500 h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
