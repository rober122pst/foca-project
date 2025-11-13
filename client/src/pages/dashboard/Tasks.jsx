import driveBanner from '../../assets/rober122-youlooklonely.jpg';
import BannerDashboard from '../../components/BannerDashboard';
import ButtonCta from '../../components/ButtonCta';
import ProfileHeader from '../../components/ProfileHeader';

export default function Tasks() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-12">
            <header>
                <ProfileHeader title="Tarefas" />
                <BannerDashboard banner={driveBanner}>
                    <h1 className="text-4xl font-black 2xl:text-5xl">Gerencie suas tarefas</h1>
                    <span className="text-gray-300">
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
