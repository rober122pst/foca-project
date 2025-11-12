import sportBanner from '../../assets/SPORTRECIFE.webp';
import BannerDashboard from '../../components/BannerDashboard';
import ButtonCta from '../../components/ButtonCta';

export default function Rotina() {
    return (
        <div className="bg-cream-100 dark:bg-night-950 h-full w-full p-12">
            <header>
                <BannerDashboard banner={sportBanner}>
                    <h1 className="text-4xl font-black 2xl:text-5xl">Crie sua rotina</h1>
                    <span>Use nossa IA para criar sua rotina. Você pode também pode criar cards únicos.</span>
                    <br />
                    <br />
                    <ButtonCta>CRIAR ROTINA</ButtonCta>
                </BannerDashboard>
            </header>
        </div>
    );
}
