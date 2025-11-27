import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { CalendarRange } from 'lucide-react';
import { SkeletonBase } from './SkeletonBase';

export default function RoutinesListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    <CalendarRange className="text-items-500" />
                    Todas as Rotinas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="scrollbar-custom h-full max-h-[445px] space-y-3 overflow-auto">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="border-border bg-card hover:bg-muted w-full cursor-pointer rounded-2xl border p-3 text-left transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <SkeletonBase className="size-10" />
                                <div className="">
                                    <SkeletonBase className="h-6 w-20" />
                                    <SkeletonBase className="mt-1 h-4 w-32" />
                                    <div className="mt-2 flex items-center gap-2">
                                        <SkeletonBase className="h-6 w-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
