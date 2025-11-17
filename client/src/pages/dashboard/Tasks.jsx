import driveBanner from '../../assets/rober122-youlooklonely.jpg';
import BannerDashboard from '../../components/BannerDashboard';
import ProfileHeader from '../../components/ProfileHeader';
import ButtonCta from '../../components/ui/ButtonCta';

export default function Tasks() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-6 md:p-12">
            <header>
                <ProfileHeader title="Tarefas" />
                <BannerDashboard banner={driveBanner}>
                    <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">Gerencie suas tarefas</h1>
                    <span className="text-gray-300 max-md:text-sm">
                        Gerencie e acompanhe suas tarefas diárias e seja recompensado!
                    </span>
                    <br />
                    <br />
                    <ButtonCta>CRIAR TAREFA</ButtonCta>
                </BannerDashboard>
            </header>
        </div>
    );
}
