import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import sportBanner from '../../assets/SPORTRECIFE.webp';
import BannerDashboard from '../../components/BannerDashboard';
import RoutineCalendar from '../../components/RoutineCalendar';
import RoutineDetails from '../../components/RoutineDetails';
import RoutinesList from '../../components/RoutinesList';
import RoutineCalendarSkeleton from '../../components/skeletons/RoutineCalendarSkeleton';
import RoutinesListSkeleton from '../../components/skeletons/RoutinesListSkeleton';
import StatsRoutineSkeleton from '../../components/skeletons/StatsRoutineSkeleton';
import StatsRoutine from '../../components/StatsRoutine';
import ButtonCta from '../../components/ui/ButtonCta';
import { useDashboardRoutines } from '../../hooks/useDashboardRoutines';
import { useModalStore } from '../../stores/useModalStore';

export default function Routine() {
    const { openModal } = useModalStore();
    const { data, isLoading, error } = useDashboardRoutines();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    if (error) return <p className="text-white">Ocorreu um erro</p>;

    const activeRoutine = selectedRoutine ? data.routines.find((r) => r.id === selectedRoutine.id) : null;

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
                {isLoading ? <StatsRoutineSkeleton /> : <StatsRoutine data={data.stats} />}

                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Calendario */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <RoutineCalendarSkeleton />
                        ) : (
                            <RoutineCalendar
                                routines={data.routines}
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                                onSelectRoutine={setSelectedRoutine}
                            />
                        )}
                    </div>
                    {/* Sidebar da direita */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <RoutinesListSkeleton />
                        ) : (
                            <RoutinesList routines={data.routines} onSelectRoutine={setSelectedRoutine} />
                        )}
                        <AnimatePresence>
                            {activeRoutine && (
                                <RoutineDetails
                                    key={activeRoutine.id}
                                    routine={activeRoutine}
                                    selectedDate={selectedDate}
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
