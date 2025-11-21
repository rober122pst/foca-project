import { Award, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import Button from './ui/Button';
import { ProgressBar } from './ui/progress';

export default function AchiviementsCard({ achievements = [] }) {
    // const achievements = [
    //     {
    //         id: '1',
    //         name: 'Primeira Vitória',
    //         description: 'Complete sua primeira tarefa',
    //         icon: Award,
    //         unlocked: true,
    //         rarity: 'common',
    //     },
    //     {
    //         id: '2',
    //         name: 'Maratonista',
    //         description: 'Complete 10 Pomodoros em um dia',
    //         icon: Award,
    //         unlocked: true,
    //         progress: 10,
    //         total: 10,
    //         rarity: 'rare',
    //     },
    //     {
    //         id: '3',
    //         name: 'Sequência de Fogo',
    //         description: 'Mantenha 7 dias de sequência',
    //         icon: Award,
    //         unlocked: true,
    //         progress: 7,
    //         total: 7,
    //         rarity: 'common',
    //     },
    //     {
    //         id: '4',
    //         name: 'Mestre da Produtividade',
    //         description: 'Complete 100 tarefas',
    //         icon: Award,
    //         unlocked: false,
    //         progress: 67,
    //         total: 100,
    //         rarity: 'rare',
    //     },
    // ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Award className="text-items-500" />
                    Conquistas
                </CardTitle>
                <Button variant="ghost" className="dark:text-cream-100 mr-4">
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`rounded-lg border p-3 transition-colors ${achievement.rarity === 'RARE' ? 'border-items-500' : 'border-cream-200 dark:border-night-800'} ${achievement.unlocked ? 'hover:bg-cream-200 dark:hover:bg-night-800' : 'opacity-60'}`}
                        >
                            <div className="flex gap-3">
                                <div
                                    className={`display-center h-fit shrink-0 rounded-lg p-3 ${achievement.unlocked ? `bg-items-500/20 ${achievement.rarity === 'rare' && 'shadow-items-500 animate-[rareAchiviementPulse_2.5s_infinite] shadow-[0_0_8px]'}` : 'bg-night-700'}`}
                                >
                                    {achievement.unlocked ? (
                                        <Award className="text-items-500 size-5" />
                                    ) : (
                                        <Lock className="text-cream-300/30 size-5" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-items-500 font-medium">{achievement.name}</p>
                                    <p className="dark:text-cream-100/60 text-items-950/60 mt-1 text-xs">
                                        {achievement.description}
                                    </p>
                                    {achievement.progress !== undefined && achievement.total && (
                                        <div className="mt-2">
                                            <div className="text text- dark:text-cream-100/60 text-items-950/60 mb-1 flex items-center justify-between text-xs">
                                                <span>Progresso</span>
                                                <span>
                                                    {achievement.progress}/{achievement.total}
                                                </span>
                                            </div>
                                            <ProgressBar
                                                progress={(achievement.progress / achievement.total) * 100}
                                                color="bg-accent-500"
                                                className="dark:bg-cream-100/25 bg-items-950/25"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
