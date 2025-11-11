import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaRegCalendar, FaRegClipboard, FaRegUser } from 'react-icons/fa6';
import { MdOutlineChat } from 'react-icons/md';
import { LuBrain } from 'react-icons/lu';
import { GoGear } from 'react-icons/go';
import { MdLogout } from 'react-icons/md';
import { IoMenu } from 'react-icons/io5';

import focaLogo from '../assets/logos/foca_logo_uncolor.svg';
import focaLogoTypo from '../assets/logos/foca_logo_uncolor_typo.svg';
import { useState } from 'react';

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { name: 'Overview', to: '/', icon: <FaChartLine /> },
        { name: 'Rotina', to: '/rotina', icon: <FaRegCalendar /> },
        { name: 'Tarefas', to: '/tarefa', icon: <FaRegClipboard /> },
        { name: 'Turmas', to: '/turmas', icon: <MdOutlineChat /> },
        { name: 'Focão AI', to: '/ai', icon: <LuBrain /> },
    ];

    const menuInsights = [
        { name: 'Perfil', to: '/u', icon: <FaRegUser /> },
        { name: 'Configurações', to: '/config', icon: <GoGear /> },
    ];

    return (
        <aside
            data-open={isOpen}
            className={
                'bg-cream-100 dark:bg-night-950 text-items-950 dark:text-cream-100 border-items-500 border-groove box-border flex h-screen w-64 flex-col overflow-hidden border-r-5 py-8 duration-700 data-[open=false]:w-22'
            }
        >
            <img src={isOpen ? focaLogoTypo : focaLogo} alt="foca-logo" className="h-full max-h-10" />
            <nav className="transition-theme my-8 mr-0 ml-4 space-y-4">
                <ul>
                    {menuItems.map((item) => {
                        const isActive = '/' + location.pathname.split('/')[2] === item.to;

                        return (
                            <Link title={item.name} replace to={`.${item.to}`} key={item.name}>
                                <li
                                    className={`hover:shadow-items-500/50 transition-theme hover:text-cream-100 box-border flex h-15 cursor-pointer items-center gap-4 rounded-l-lg p-4 text-xl text-nowrap hover:shadow-[inset_250px_0_0] ${isActive && 'shadow-items-500/50 shadow-[inset_250px_0_0]'}`}
                                >
                                    <span>{item.icon}</span>
                                    <span
                                        className={`transition-theme whitespace-nowrap delay-300 ${!isOpen && '-translate-x-3 opacity-0'}`}
                                    >
                                        {item.name}
                                    </span>
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            </nav>
            <nav className="transition-theme my-8 mr-0 ml-4 space-y-4">
                <ul>
                    {menuInsights.map((item) => (
                        <Link title={item.name} to={`.${item.to}`} key={item.name}>
                            <li className="hover:shadow-items-500/50 transition-theme hover:text-cream-100 box-border flex h-15 cursor-pointer items-center gap-4 rounded-l-lg p-4 text-xl text-nowrap hover:shadow-[inset_250px_0_0]">
                                <span>{item.icon}</span>
                                <span
                                    className={`transition-theme whitespace-nowrap delay-300 ${!isOpen && '-translate-x-3 opacity-0'}`}
                                >
                                    {item.name}
                                </span>
                            </li>
                        </Link>
                    ))}
                    <a href="/auth/logout">
                        <li
                            title="Sair"
                            className="hover:shadow-items-500/50 transition-theme hover:text-cream-100 box-border flex h-15 cursor-pointer items-center gap-4 rounded-l-lg p-4 text-xl hover:shadow-[inset_250px_0_0]"
                        >
                            <span>
                                <MdLogout />
                            </span>
                            <span
                                className={`transition-theme whitespace-nowrap delay-300 ${!isOpen && '-translate-x-3 opacity-0'}`}
                            >
                                Sair
                            </span>
                        </li>
                    </a>
                </ul>
            </nav>
            <button
                className="mx-auto mt-auto mb-8 cursor-pointer"
                title={isOpen ? 'Encolher' : 'Expandir'}
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoMenu size={30} className="text-items-500" />
            </button>
        </aside>
    );
}
