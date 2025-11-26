import { CalendarCheck2, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';

import { useResponsive } from '../../hooks/useResponsive.js';
import Button from '../ui/Button.jsx';
import { SkeletonBase } from './SkeletonBase.jsx';

export default function RoutineCalendarSkeleton({ selectedDate, onSelectDate, onSelectRoutine, routines = [] }) {
    const isResponsive = useResponsive(640);

    return (
        <div className="w-full space-y-6">
            {/* Calendario */}
            <Card>
                <CardHeader>
                    <div className="flex flex-1 items-center justify-between">
                        <CardTitle className="text-lg">
                            <CalendarDays className="text-items-500" />
                            <SkeletonBase className="h-6 w-36" />
                        </CardTitle>
                        <div className="flex gap-1">
                            <Button variant="outline" disabled>
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button variant="outline" disabled>
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div key={index} className="text-medium p-2 text-center text-xs font-semibold">
                                <SkeletonBase className="h-4 w-full" />
                            </div>
                        ))}
                        {Array.from({ length: 42 }).map((_, index) => (
                            <SkeletonBase key={index} className="min-h-[50px] rounded-md" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Cronograma do dia */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                        <CalendarCheck2 className="text-items-500" />
                        <SkeletonBase className="h-6 w-48" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="scrollbar-custom h-full max-h-[350px] space-y-3 overflow-y-auto p-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div
                                key={index}
                                className="border-border bg-card hover:bg-muted w-full cursor-pointer rounded-2xl border p-3 text-left transition-colors"
                            >
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className={'bg-muted h-10 w-1 rounded-full sm:h-12'} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <SkeletonBase className="h-6 w-20" />
                                        </div>
                                        <SkeletonBase className="mt-1 h-5 w-48" />
                                        <div className="text-items-500 mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-4">
                                            <SkeletonBase className="h-4 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
