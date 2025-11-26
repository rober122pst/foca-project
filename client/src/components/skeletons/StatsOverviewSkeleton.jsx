import { Calendar, Check, Flame, Timer } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

import { SkeletonBase } from './SkeletonBase';

export default function StatsOverviewSkeleton() {
    const stats = [
        { icon: Flame, label: 'Sequência' },
        { icon: Timer, label: 'Tempo em foco' },
        { icon: Check, label: 'Tarefas concluídas' },
        { icon: Calendar, label: 'Rotinas ativas' },
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
                                <SkeletonBase className="h-8 w-24" />
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
