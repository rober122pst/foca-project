import { Outlet } from 'react-router-dom';
import NavbarMobile from '../components/NavbarMobile';
import Sidebar from '../components/Sidebar';
import { useResponsive } from '../hooks/useResponsive';

export default function DashboardLayout() {
    const isMobile = useResponsive(1024);
    return (
        <div className="flex">
            {isMobile ? <NavbarMobile /> : <Sidebar />}
            <main className="bg-cream-200 dark:bg-night-950 m-auto h-fit w-full overflow-auto [-webkit-overflow-scrolling:touch] lg:h-screen">
                <Outlet />
            </main>
        </div>
    );
}
