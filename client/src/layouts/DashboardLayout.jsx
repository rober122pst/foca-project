import { Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import NavbarMobile from '../components/NavbarMobile';
import ProfileHeader from '../components/ProfileHeader';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

export default function DashboardLayout() {
    const isMobile = useResponsive(1024);
    const { pathname } = useLocation();
    const { isLoading } = useAuth();

    const titles = {
        '/dashboard': 'Visão Geral',
        '/dashboard/rotina': 'Rotina',
        '/dashboard/tarefa': 'Tarefas',
        '/dashboard/turmas': 'Turmas',
        '/dashboard/ai': 'Focão AI',
    };

    const title = titles[pathname] ?? 'Painel';

    return (
        <>
            <LoadingScreen isLoading={isLoading} />
            {!isLoading && (
                <div className="flex">
                    {isMobile ? <NavbarMobile /> : <Sidebar />}
                    <main className="bg-cream-200 dark:bg-night-950 m-auto h-fit w-full overflow-auto [-webkit-overflow-scrolling:touch] lg:h-screen">
                        <div className="bg-cream-200 dark:bg-night-950 m-auto h-auto w-full max-w-[1294px] p-4 lg:p-6">
                            <header className="mt-2">
                                <ProfileHeader title={title} />
                            </header>
                            <Outlet />
                        </div>
                    </main>
                </div>
            )}
        </>
    );
}
