import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaRegCalendar, FaRegClipboard } from 'react-icons/fa6';
import { MdOutlineChat } from 'react-icons/md';
import { LuBrain } from 'react-icons/lu';
import { useEffect, useRef, useState, useCallback, act } from 'react';

export default function NavbarMobile() {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, left: 0, width: 0, top: 0, height: 0 });
    const itemsRef = useRef([]);

    const menuItems = [
        { name: 'Turmas', to: '/turmas', icon: <MdOutlineChat /> },
        { name: 'Rotina', to: '/rotina', icon: <FaRegCalendar /> },
        { name: 'Overview', to: '', icon: <FaChartLine /> },
        { name: 'Tarefas', to: '/tarefa', icon: <FaRegClipboard /> },
        { name: 'Focão AI', to: '/ai', icon: <LuBrain /> },
    ];

    const [activeIndex, setActiveIndex] = useState(() => {
        const i = menuItems.findIndex((item) => location.pathname === `/dashboard${item.to}`);
        return i || 2;
    });

    // Função pra mudar indicador de lugar
    const updateIndicator = useCallback(() => {
        const item = itemsRef.current[activeIndex];

        if (item) {
            setIndicatorStyle({
                opacity: 1,
                left: item.offsetLeft,
                width: item.offsetWidth,
                top: item.offsetTop,
                height: item.offsetHeight,
            });
        }
    }, [activeIndex]);

    // Efeito pra atualizar o indicador quando activeIndex mudar
    useEffect(() => {
        updateIndicator();
        console.log(activeIndex);
    }, [activeIndex, updateIndicator]);

    // Definir a posição inicial do indicador e atualizar quando a janela for redimensionada
    useEffect(() => {
        updateIndicator();

        window.addEventListener('resize', updateIndicator);

        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    return (
        <nav className="bg-cream-100 dark:bg-night-950 text-items-950 dark:text-cream-100 display-center fixed bottom-4 left-1/2 box-content flex -translate-x-1/2 rounded-xl px-4 py-3">
            <span
                className="bg-items-500/50 absolute z-0 rounded-md duration-300 ease-in-out"
                style={indicatorStyle}
                aria-hidden
            ></span>
            <ul className="flex w-full justify-around gap-8">
                {menuItems.map((item, index) => (
                    <Link
                        ref={(el) => (itemsRef.current[index] = el)}
                        key={item.name}
                        to={`.${item.to}`}
                        onClick={() => setActiveIndex(index)}
                        className="relative z-10"
                    >
                        <li className="hover:bg-items-500/50 rounded-md p-2 text-2xl duration-300">
                            <div>{item.icon}</div>
                        </li>
                    </Link>
                ))}
            </ul>
        </nav>
    );
}
