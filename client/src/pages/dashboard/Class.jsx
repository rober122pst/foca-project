import banner from '../../assets/rober122-dido1.gif';
import BannerDashboard from '../../components/BannerDashboard';
import ProfileHeader from '../../components/ProfileHeader';

export default function Class() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-12">
            <header>
                <ProfileHeader title="Turmas" />
                <BannerDashboard banner={banner} />
            </header>
        </div>
    );
}
