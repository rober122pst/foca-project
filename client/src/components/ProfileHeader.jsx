import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { CircleDollarSign } from 'lucide-react';
import placeholderAvatar from '../assets/foxy.webp';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileHeader({ title }) {
    const { user } = useAuth();
    const userProf = user.profile;
    const userGame = userProf.gamefication;

    const formattedCoins = userGame.coins.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

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
                </div>
                <div className="border-items-500 h-10 w-10 overflow-hidden rounded-full border-2 sm:h-12 sm:w-12">
                    <Avatar>
                        <AvatarImage src={userProf.picUrl || placeholderAvatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
