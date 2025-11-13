import { Outlet } from 'react-router-dom';
import NavbarMobile from '../components/NavbarMobile';
import Sidebar from '../components/Sidebar';
import { useResponsive } from '../hooks/useResponsive';

export default function DashboardLayout() {
    const isMobile = useResponsive(1024);
    return (
        <div className="flex">
            {isMobile ? <NavbarMobile /> : <Sidebar />}
            <main className="min-h-screen w-full overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
