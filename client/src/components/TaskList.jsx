import { Check, MoreVertical, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useState } from 'react';
import Button from './ui/Button';

export default function TaskList() {
    const [tasks, setTasks] = useState([
        {
            id: '1',
            title: 'Estudar para prova de Matemática',
            completed: false,
            priority: 'high',
            deadline: '2025-11-17T03:22:10Z',
            tags: ['Estudos', 'Urgente'],
        },
        {
            id: '2',
            title: 'Completar exercícios de Física',
            completed: false,
            priority: 'medium',
            deadline: '2025-11-19T14:55:47Z',
            tags: ['Estudos'],
        },
        {
            id: '3',
            title: 'Revisar anotações de História',
            completed: true,
            priority: 'low',
            deadline: '2025-11-23T21:10:05Z',
            tags: ['Revisão'],
        },
        {
            id: '4',
            title: 'Fazer resumo de Biologia',
            completed: false,
            priority: 'medium',
            deadline: '2025-11-26T08:39:31Z',
            tags: ['Estudos'],
        },
    ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Check className="text-items-500 mr-1.5 inline" />
                    Tarefas de hoje
                </CardTitle>
                <Button className="dark:text-cream-100 text-items-950 mr-4" variant="ghost">
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-card hover:bg-muted/50 border-cream-200 dark:border-night-800 hover:bg-cream-200 dark:hover:bg-night-800 flex w-full items-start gap-3 rounded-lg border p-3 transition-colors"
                        >
                            <input
                                type="checkbox"
                                className="checked:border-accent-500 checked:bg-accent-500 border-cream-300 dark:border-night-700 focus:ring-accent-600 checked:focus:ring-accent-600 h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-all focus:ring-2 focus:outline-none"
                                checked={task.completed}
                                onChange={(e) =>
                                    setTasks((prev) =>
                                        prev.map((t) => (t.id === task.id ? { ...t, completed: e.target.checked } : t))
                                    )
                                }
                            />
                            <div className="flex-1">
                                <p
                                    className={`dark:text-cream-100 text-items-950 font-medium ${task.completed ? 'line-through' : ''}`}
                                >
                                    {task.title}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <div className="text-items-500 flex items-center gap-1 text-xs">
                                        <Timer className="h-4 w-4" />
                                        {new Date(task.deadline).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                        })}
                                    </div>
                                    {task.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-cream-300 dark:bg-night-700 rounded-md px-2 py-1 text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Button variant="ghost" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
