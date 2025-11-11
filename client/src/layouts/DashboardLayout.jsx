import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavbarMobile from '../components/NavbarMobile';

export default function DashboardLayout() {
    return (
        <div className="flex">
            <NavbarMobile />
            <main className="min-h-screen overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
