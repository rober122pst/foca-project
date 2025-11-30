import { Calendar, Plus, Sparkles, Timer, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../stores/useModalStore';
import Button from './ui/Button';

export default function QuickActions() {
    const { openModal } = useModalStore();
    const navigate = useNavigate();

    const actions = [
        { icon: Timer, label: 'Iniciar Pomodoro', variant: 'default', action: () => navigate('/pomodoro') },
        { icon: Plus, label: 'Nova Atividade', variant: 'outline', action: () => openModal('create-routine') },
        { icon: Sparkles, label: 'Gerar Rotina IA', variant: 'outline', action: () => openModal('create-routine-ai') },
        { icon: Calendar, label: 'Ver Calendário', variant: 'outline', action: () => navigate('/dashboard/rotina') },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Zap className="text-items-500" />
                    Ações rápidas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant={action.variant}
                            className="flex h-auto flex-col items-center gap-2 rounded-2xl py-6"
                            onClick={action.action}
                        >
                            <action.icon className="h-6 w-6" />
                            <span className="text-xs">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
