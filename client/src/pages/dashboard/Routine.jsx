import { AnimatePresence } from 'motion/react';
import BannerDashboard from '../../components/BannerDashboard';
import ButtonCta from '../../components/ui/ButtonCta';
import RoutineCalendar from '../../components/RoutineCalendar';
import RoutineDetails from '../../components/RoutineDetails';
import RoutinesList from '../../components/RoutinesList';
import StatsRoutine from '../../components/StatsRoutine';
import sportBanner from '../../assets/SPORTRECIFE.webp';
import { useDashboardRoutines } from '../../hooks/useDashboardRoutines';
import { useModalStore } from '../../../stores/useModalStore';
import { useState } from 'react';

export default function Routine() {
    const { openModal } = useModalStore();
    const { data, isLoading, error } = useDashboardRoutines();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    if (isLoading) return <p className="text-white">carregando...</p>;
    if (error) return <p className="text-white">Ocorreu um erro</p>;

    return (
        <>
            <BannerDashboard banner={sportBanner}>
                <h1 className="text-2xl font-black md:text-3xl lg:text-4xl 2xl:text-5xl">Crie sua rotina</h1>
                <span>Use nossa IA para criar sua rotina. Você pode também pode criar cards únicos.</span>
                <br />
                <br />
                <ButtonCta onClick={() => openModal('create-routine')}>CRIAR ROTINA</ButtonCta>
            </BannerDashboard>
            <div className="mt-5">
                <StatsRoutine data={data.stats} />

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Calendario */}
                    <div className="lg:col-span-2">
                        <RoutineCalendar
                            routines={data.routines}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            onSelectRoutine={setSelectedRoutine}
                        />
                    </div>
                    {/* Sidebar da direita */}
                    <div className="space-y-6">
                        <RoutinesList routines={data.routines} onSelectRoutine={setSelectedRoutine} />

                        <AnimatePresence>
                            {selectedRoutine && (
                                <RoutineDetails
                                    key={selectedRoutine.id}
                                    routine={selectedRoutine}
                                    onClose={() => setSelectedRoutine(null)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}
