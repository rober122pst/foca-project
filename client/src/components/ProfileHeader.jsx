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
                <span className="dark:text-cream-100 text-items-950 text-md sm:text-base md:text-xl/1">
                    Olá <strong>{user.name},</strong>
                </span>
                <h1 className="text-items-500 text-3xl font-black sm:text-4xl md:text-5xl">{title}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <div>
                    <div className="mt-1 flex items-center gap-0.5">
                        <CircleDollarSign className="text-accent-500 max-sm:w-4" />
                        <span className="text-items-950 dark:text-cream-100 ml-1 align-middle font-extrabold max-sm:text-sm">
                            {formattedCoins}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <Star className="text-accent-500 max-sm:w-4" />
                        <div className="bg-items-950 h-1 w-16 overflow-hidden rounded-md sm:h-1.5 sm:w-24">
                            <div className="bg-items-500 h-full w-2/3"></div>
                        </div>
                    </div>
                </div>
                <div className="border-items-500 h-10 w-10 overflow-hidden rounded-full border-2 sm:h-12 sm:w-12">
                    <img className="h-full w-full object-cover object-center" src={user.profPic} alt="perfil" />
                </div>
            </div>
        </div>
    );
}
