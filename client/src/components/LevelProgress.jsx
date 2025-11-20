import { Card, CardContent } from './ui/card';

import { Trophy } from 'lucide-react';
import { localeNumber } from '../../utils/formatString';
import { ProgressBar } from './ui/progress';

export default function LevelProgress({ levelProgress }) {
    const level = levelProgress?.level || 0;
    const xp = levelProgress?.currentXp || 0;
    const xpToNext = levelProgress?.nextLevelXp || 0;

    return (
        <Card className="to-items-900 from-items-700 border-none bg-linear-to-tl">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-cream-100/90 text-sm">Progresso para o nível {level}</p>
                        <p className="text-cream-100 text-2xl font-bold">
                            {xp} / {localeNumber(xpToNext)} XP
                        </p>
                    </div>
                    <Trophy className="text-cream-100 h-10 w-10" />
                </div>
                <ProgressBar progress={(xp / Math.round(xpToNext)) * 100} className="mt-3 h-2" />
            </CardContent>
        </Card>
    );
}
