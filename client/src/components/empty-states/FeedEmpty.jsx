import { UserPlus, Users } from 'lucide-react';

import Button from '../ui/Button';

export default function FeedEmpty() {
    return (
        <div className="display-center flex-col py-12 text-center">
            <div className="display-center bg-cream-200 dark:bg-night-800 mb-4 size-20 rounded-full">
                <Users className="text-items-500 size-10" />
            </div>
            <h3 className="text-items-950 dark:text-cream-100 mb-2 font-semibold">Nenhuma atividade ainda</h3>
            <p className="text-medium text-md mb-4 max-w-sm font-medium">
                Conecte-se com amigos para ver suas conquistas e progresso!
            </p>
            <Button>
                <UserPlus className="h-6 w-6" />
                <span className="text-base">Adicionar amigos</span>
            </Button>
        </div>
    );
}
