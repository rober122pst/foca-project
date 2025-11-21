import { useState } from 'react';
import sportBanner from '../../assets/SPORTRECIFE.webp';
import BannerDashboard from '../../components/BannerDashboard';
import RoutineCalendar from '../../components/RoutineCalendar';
import RoutineDetails from '../../components/RoutineDetails';
import RoutinesList from '../../components/RoutinesList';
import StatsRoutine from '../../components/StatsRoutine';
import ButtonCta from '../../components/ui/ButtonCta';

export default function Routine() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    return (
        <>
            <BannerDashboard banner={sportBanner}>
                <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">Crie sua rotina</h1>
                <span>Use nossa IA para criar sua rotina. Você pode também pode criar cards únicos.</span>
                <br />
                <br />
                <ButtonCta>CRIAR ROTINA</ButtonCta>
            </BannerDashboard>
            <div className="mt-5">
                <StatsRoutine />

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Calendario */}
                    <div className="lg:col-span-2">
                        <RoutineCalendar
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            onSelectRoutine={setSelectedRoutine}
                        />
                    </div>
                    {/* Sidebar da direita */}
                    <div className="space-y-6">
                        <RoutinesList onSelectRoutine={setSelectedRoutine} />

                        <RoutineDetails routine={selectedRoutine} onClose={() => setSelectedRoutine(null)} />
                    </div>
                </div>
            </div>
        </>
    );
}
