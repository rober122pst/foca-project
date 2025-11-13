import banner from '../../assets/rober122-lalaland.jpg';
import BannerDashboard from '../../components/BannerDashboard';
import ProfileHeader from '../../components/ProfileHeader';

export default function AiPage() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-6 md:p-12">
            <header>
                <ProfileHeader title="Focão AI" />
                <BannerDashboard banner={banner} />
            </header>
        </div>
    );
}
