import { ClipboardList, Plus } from 'lucide-react';

import Button from '../ui/Button';

export default function TaskListEmpty() {
    return (
        <div className="display-center flex-col py-12 text-center">
            <div className="display-center bg-cream-200 dark:bg-night-800 mb-4 size-20 rounded-full">
                <ClipboardList className="text-items-500 size-10" />
            </div>
            <h3 className="text-items-950 dark:text-cream-100 mb-2 font-semibold">Nenhuma tarefa ainda</h3>
            <p className="text-medium text-md mb-4 max-w-sm font-medium">
                Comece sua jornada de produtividade criando sua primeira tarefa.
            </p>
            <Button>
                <Plus className="h-6 w-6" />
                <span className="text-base">Criar primeira tarefa</span>
            </Button>
        </div>
    );
}
