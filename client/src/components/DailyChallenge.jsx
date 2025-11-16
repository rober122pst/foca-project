import { Card, CardHeader, CardTitle } from './ui/card';

import { Trophy } from 'lucide-react';

export default function DailyChallenge() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Trophy />
                    Desafio diário
                </CardTitle>
            </CardHeader>
        </Card>
    );
}
