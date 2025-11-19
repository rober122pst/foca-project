import { Check, MoreVertical, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import TaskListEmpty from './empty-states/TaskListEmpty';
import Button from './ui/Button';

export default function TaskList({ tasks, onToggle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Check className="text-items-500 mr-1.5 inline" />
                    Tarefas de hoje
                </CardTitle>
                {tasks.length > 0 && (
                    <Button className="dark:text-cream-100 text-items-950 mr-4" variant="ghost">
                        Ver todas
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="border-cream-200 dark:border-night-800 hover:bg-cream-200 dark:hover:bg-night-800 flex w-full items-start gap-3 rounded-lg border p-3 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    className="checked:border-accent-500 checked:bg-accent-500 border-cream-300 dark:border-night-700 focus:ring-accent-600 checked:focus:ring-accent-600 h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-all focus:ring-2 focus:outline-none"
                                    checked={task.completed}
                                    onChange={onToggle}
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
                        ))
                    ) : (
                        <TaskListEmpty />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
