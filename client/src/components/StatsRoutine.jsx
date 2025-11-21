import { CheckCircle2, Flame, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function StatsRoutine() {
    const stats = [
        {
            icon: Target,
            label: 'Rotinas Ativas',
            value: '8',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Flame,
            label: 'Maior Sequência',
            value: '30 dias',
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            icon: CheckCircle2,
            label: 'Taxa de Conclusão',
            value: '85%',
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            icon: TrendingUp,
            label: 'Esta Semana',
            value: '24/28',
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
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
