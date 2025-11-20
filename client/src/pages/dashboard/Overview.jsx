import spiderBanner from '../../assets/spider-man.webp';
import AchiviementsCard from '../../components/AchiviementsCard';
import ActivityFeed from '../../components/ActivityFeed';
import BannerDashboard from '../../components/BannerDashboard';
import ChardsOverview from '../../components/ChardsOverview';
import DailyChallenge from '../../components/DailyChallenge';
import LevelProgress from '../../components/LevelProgress';
import QuickActions from '../../components/QuickActions';
import StatsOverview from '../../components/StatsOverview';
import TaskList from '../../components/TaskList';
import { useDashboardOverview } from '../../hooks/useDashboardOverview';

export default function Overview() {
    const { data, isLoading, error } = useDashboardOverview();

    const date = new Date()
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        .split(' ')
        .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join(' ');

    console.log(data);

    if (isLoading) return <h1>Carregando...</h1>;
    if (error) return <h1>Deu erro</h1>;

    return (
        <>
            <BannerDashboard banner={spiderBanner}>
                <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">{date}</h1>
                <span>Sua central de foco</span>
            </BannerDashboard>

            <div className="mt-5">
                <div>
                    <StatsOverview userStats={data.stats} />
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Coluna na esquerda */}
                    <div className="space-y-5 lg:col-span-2">
                        <LevelProgress levelProgress={data.levelProgress} />
                        <QuickActions />
                        <ChardsOverview />
                        <TaskList tasks={data.taskList} />
                    </div>
                    {/* Coluna da direita */}
                    <div className="space-y-5">
                        <DailyChallenge />
                        <AchiviementsCard achievements={data.achievements} />
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </>
    );
}
