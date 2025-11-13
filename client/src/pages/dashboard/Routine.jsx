import sportBanner from '../../assets/SPORTRECIFE.webp';
import BannerDashboard from '../../components/BannerDashboard';
import ProfileHeader from '../../components/ProfileHeader';
import ButtonCta from '../../components/ui/ButtonCta';

export default function Routine() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-6 md:p-12">
            <header>
                <ProfileHeader title="Rotina" />
                <BannerDashboard banner={sportBanner}>
                    <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">Crie sua rotina</h1>
                    <span>Use nossa IA para criar sua rotina. Você pode também pode criar cards únicos.</span>
                    <br />
                    <br />
                    <ButtonCta>CRIAR ROTINA</ButtonCta>
                </BannerDashboard>
            </header>
        </div>
    );
}
