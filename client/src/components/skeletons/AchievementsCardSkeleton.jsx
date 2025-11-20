import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { Award } from 'lucide-react';
import { SkeletonBase } from './SkeletonBase';

export default function AchievementsCardSkeleton() {
    const achievements = [1, 2, 3, 4];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Award className="text-items-500 mr-1.5 inline" />
                    Conquistas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement}
                            className="border-cream-200 dark:border-night-800 rounded-lg border p-3 transition-colors"
                        >
                            <div className="flex gap-3">
                                <SkeletonBase className="size-11" />
                                <div className="flex-1">
                                    <SkeletonBase className="h-6 w-36" />
                                    <SkeletonBase className="mt-1 h-4 w-64" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
