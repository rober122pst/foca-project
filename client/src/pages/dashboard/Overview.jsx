import spiderBanner from '../../assets/spider-man.webp';
import ActivityFeed from '../../components/ActivityFeed';
import BannerDashboard from '../../components/BannerDashboard';
import LevelProgress from '../../components/LevelProgress';
import ProfileHeader from '../../components/ProfileHeader';
import QuickActions from '../../components/QuickActions';
import StatsOverview from '../../components/StatsOverview';
import TaskList from '../../components/TaskList';

export default function Overview() {
    const date = new Date()
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        .split(' ')
        .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join(' ');

    return (
        <div className="bg-cream-200 dark:bg-night-950 m-auto h-auto w-fit p-4 lg:p-6">
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
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Coluna na esquerda */}
                    <div className="space-y-5 lg:col-span-2">
                        <LevelProgress />
                        <QuickActions />
                        <TaskList />
                    </div>
                    {/* Coluna da direita */}
                    <div>
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    );
}
