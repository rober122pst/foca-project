import { Flame, History, Target, Trophy, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import placeholderAvatar from '../assets/foxy.webp';
import FeedEmpty from './empty-states/FeedEmpty';

export default function ActivityFeed({ activities = [] }) {
    // const [activities, setActivities] = useState([
    //     {
    //         id: '1',
    //         user: 'Maria Silva',
    //         action: 'alcançou Nível 15! 🎉',
    //         time: '5 min atrás',
    //         type: 'achievement',
    //     },
    //     {
    //         id: '2',
    //         user: 'Pedro Santos',
    //         action: 'completou 10 tarefas hoje',
    //         time: '12 min atrás',
    //         type: 'task',
    //     },
    //     {
    //         id: '3',
    //         user: 'Ana Costa',
    //         action: 'entrou na turma "Matemática Avançada"',
    //         time: '1h atrás',
    //         type: 'social',
    //     },
    //     {
    //         id: '4',
    //         user: 'Carlos Oliveira',
    //         action: 'mantém sequência de 30 dias! 🔥',
    //         time: '2h atrás',
    //         type: 'streak',
    //     },
    // ]);

    const typeIcons = {
        achievement: Trophy,
        task: Target,
        social: Users,
        streak: Flame,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <History className="text-items-500 mr-1.5 inline" />
                    Atividades recentes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const Icon = typeIcons[activity.type];
                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarImage src={activity.avatar || placeholderAvatar} />
                                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2">
                                            <Icon className="text-items-500 mt-1 h-4 w-4" />
                                            <div>
                                                <p className="text-sm">
                                                    <span className="font-semibold">{activity.user}</span>{' '}
                                                    {activity.action}
                                                </p>
                                                <p className="text-accent-500 text-xs">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <FeedEmpty />
                )}
            </CardContent>
        </Card>
    );
}
