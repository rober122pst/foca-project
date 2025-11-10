import { Link } from 'react-router-dom';

export default function Sidebar() {
    const menuItems = [
        { name: 'Overview', to: '/' },
        { name: 'Rotina', to: '/rotina' },
        { name: 'Tarefas', to: '/tarefa' },
        { name: 'Turmas', to: '/turmas' },
        { name: 'Focão AI', to: '/ai' },
    ];

    return (
        <nav>
            <ul className={'flex h-screen w-60 flex-col space-y-4 bg-gray-800 p-4 text-white'}>
                {menuItems.map((item) => (
                    <li key={item.name}>
                        <Link to={`.${item.to}`} className="block rounded px-4 py-2 hover:bg-gray-700">
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
