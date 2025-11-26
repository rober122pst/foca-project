import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { Check } from 'lucide-react';
import Button from '../ui/Button';
import { SkeletonBase } from './SkeletonBase';

export default function TaskListSkeleton() {
    const tasks = [1, 2, 3, 4];
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
                    {tasks.map((task) => (
                        <div
                            key={task}
                            className="border-cream-200 dark:border-night-800 hover:bg-cream-200 dark:hover:bg-night-800 flex w-full items-start gap-3 rounded-lg border p-3 transition-colors"
                        >
                            <div className="border-cream-300 dark:border-night-700 h-5 w-5 cursor-pointer appearance-none rounded border-2"></div>
                            <div className="flex-1">
                                <SkeletonBase className="h-6 w-64" />
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <SkeletonBase className="h-5 w-40" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
