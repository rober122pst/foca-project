import { Calendar, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

import { SkeletonBase } from './SkeletonBase';

export default function StatsRoutineSkeleton() {
    const stats = [
        {
            icon: Calendar,
            label: 'Rotinas Ativas',
        },
        {
            icon: Flame,
            label: 'Maior Sequência',
        },
        {
            icon: CheckCircle2,
            label: 'Taxa de Conclusão',
        },
        {
            icon: TrendingUp,
            label: 'Esta Semana',
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
