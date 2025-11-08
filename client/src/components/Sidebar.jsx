import { Link } from "react-router-dom";

export default function Sidebar() {
    const menuItems = [
        { name: 'Overview', to: '/' },
        { name: 'Rotina', to: '/rotina' },
        { name: 'Tarefas', to: '/tarefa' },
        { name: 'Turmas', to: '/turmas' },
        { name: 'Focão AI', to: '/ai' },
    ]

    return (
        <nav>
            <ul className="flex flex-col p-4 space-y-4 bg-gray-800 text-white h-screen w-60">
                {menuItems.map((item) => (
                    <li key={item.name}>
                        <Link
                            to={`.${item.to}`}
                            className="block px-4 py-2 rounded hover:bg-gray-700"
                        >   
                            {item.name}
                        </Link>
                    </li>
                ))}
                    
            </ul>
        </nav>
    );
}