import { CircleDollarSign, Star, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { useState } from 'react';

export default function DailyChallenge() {
    const [challenge, setChallenge] = useState({
        title: 'Titulo do desafio',
        description: 'Aqui irá ficar a descrição do desafio diário.',
        rewardCoins: 50,
        rewardXP: 20,
    });

    const formattedCoins = challenge.rewardCoins.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Trophy className="text-items-500 mr-1.5 inline" />
                    Desafio diário
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div>
                    <h1 className="text-items-500 text-2xl font-extrabold">{challenge.title}</h1>
                    <p className="text-sm">{challenge.description}</p>
                </div>
                <div className="space-y-1.5">
                    <div className="text-md flex items-center gap-1.5">
                        <Star className="text-accent-500 size-5" />
                        <span className="font-black">{challenge.rewardXP}</span>
                    </div>
                    <div className="text-md flex items-center gap-1.5">
                        <CircleDollarSign className="text-accent-500 size-5" />
                        <span className="font-black">{formattedCoins}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
