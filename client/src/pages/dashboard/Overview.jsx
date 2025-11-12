import spiderBanner from '../../assets/spider-man.webp';
import BannerDashboard from '../../components/BannerDashboard';

export default function Overview() {
    const date = new Date()
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        .split(' ')
        .map((p, i) => (i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join(' ');

    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-12">
            <header>
                <BannerDashboard banner={spiderBanner}>
                    <h1 className="text-4xl font-black 2xl:text-5xl">{date}</h1>
                    <span>Sua central de foco</span>
                </BannerDashboard>
            </header>
        </div>
    );
}
