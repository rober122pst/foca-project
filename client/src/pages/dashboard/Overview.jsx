import { Card, CardContent } from '../../components/ui/Card';

import BannerDashboard from '../../components/BannerDashboard';
import ProfileHeader from '../../components/ProfileHeader';
import StatsOverview from '../../components/StatsOverview';
import spiderBanner from '../../assets/spider-man.webp';

export default function Overview() {
    const date = new Date()
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        .split(' ')
        .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join(' ');

    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-6 md:p-12">
            <header>
                <ProfileHeader title="Visão Geral" />
                <BannerDashboard banner={spiderBanner}>
                    <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">{date}</h1>
                    <span>Sua central de foco</span>
                </BannerDashboard>
            </header>
            <div className="mt-5">
                <div>
                    <StatsOverview />
                </div>
                <div className="mt-5 grid lg:grid-cols-3">
                    {/* Coluna na esquerda */}
                    <div className="space-y-5 lg:col-span-2">
                        <Card className="to-items-900 from-items-700 h-48 border-none bg-linear-to-tl">
                            <CardContent></CardContent>
                        </Card>
                        <Card className="to-items-900 from-items-700 h-48 border-none bg-linear-to-tl">
                            <CardContent></CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
