import { Card, CardContent } from './ui/card';

import { Trophy } from 'lucide-react';
import { ProgressBar } from './ui/progress';

export default function LevelProgress() {
    return (
        <Card className="to-items-900 from-items-700 border-none bg-linear-to-tl">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-cream-100/90 text-sm">Progresso para o nível 13</p>
                        <p className="text-cream-100 text-2xl font-bold">450 / 3,000 XP</p>
                    </div>
                    <Trophy className="text-cream-100 h-10 w-10" />
                </div>
                <ProgressBar progress={42} className="mt-3 h-2" />
            </CardContent>
        </Card>
    );
}
