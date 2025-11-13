import { CircleDollarSign, Star } from 'lucide-react';

import { useState } from 'react';
import profilePic from '../assets/foxy.webp';

export default function ProfileHeader({ title }) {
    const [user, setUser] = useState({
        name: 'Fulano',
        coins: 1000,
        profPic: profilePic,
    });

    const formattedCoins = user.coins.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    return (
        <div className="mb-12 flex justify-between">
            <div>
                <span className="dark:text-cream-100 text-items-950 text-xl/1">
                    Olá <strong>{user.name},</strong>
                </span>
                <h1 className="text-items-500 text-5xl font-black">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <div>
                        <CircleDollarSign className="text-accent-500 inline" />
                        <span className="text-items-950 dark:text-cream-100 ml-1 align-middle font-extrabold">
                            {formattedCoins}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <Star className="text-accent-500" />
                        <div className="bg-items-950 h-1.5 w-24 overflow-hidden rounded-md">
                            <div className="bg-items-500 h-full w-2/3"></div>
                        </div>
                    </div>
                </div>
                <div className="border-items-500 h-12 w-12 overflow-hidden rounded-full border-2">
                    <img className="h-full w-full object-cover object-center" src={user.profPic} alt="perfil" />
                </div>
            </div>
        </div>
    );
}
