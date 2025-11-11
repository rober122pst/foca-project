import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaRegCalendar, FaRegClipboard } from 'react-icons/fa6';
import { MdOutlineChat } from 'react-icons/md';
import { LuBrain } from 'react-icons/lu';

export default function NavbarMobile() {
    const location = useLocation();

    const menuItems = [
        { name: 'Turmas', to: '/turmas', icon: <MdOutlineChat /> },
        { name: 'Rotina', to: '/rotina', icon: <FaRegCalendar /> },
        { name: 'Overview', to: '/', icon: <FaChartLine /> },
        { name: 'Tarefas', to: '/tarefa', icon: <FaRegClipboard /> },
        { name: 'Focão AI', to: '/ai', icon: <LuBrain /> },
    ];

    return (
        <nav className="bg-cream-100 dark:bg-night-950 text-items-950 dark:text-cream-100 display-center fixed bottom-4 left-[50%] box-content flex h-14 w-7/8 -translate-x-[50%] rounded-xl">
            <div className="bg-items-500 absolute z-0 rounded-md"></div>
            <ul className="flex w-full justify-around">
                {menuItems.map((item) => {
                    const isActive = '/' + location.pathname.split('/')[2] === item.to;

                    return (
                        <Link to={`.${item.to}`}>
                            <li className={`rounded-md p-2 text-xl ${isActive && 'bg-items-500'}`}>
                                <div>{item.icon}</div>
                            </li>
                        </Link>
                    );
                })}
            </ul>
        </nav>
    );
}
