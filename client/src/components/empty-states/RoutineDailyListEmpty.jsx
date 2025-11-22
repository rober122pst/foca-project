import { CalendarX } from 'lucide-react';

export default function RoutineDailyListEmpty() {
    return (
        <div className="display-center flex-col py-12 text-center">
            <div className="display-center bg-cream-200 dark:bg-night-800 mb-4 size-20 rounded-full">
                <CalendarX className="text-items-500 size-10" />
            </div>
            <p className="text-medium text-md font-medium">Nenhuma rotina programada para este dia</p>
        </div>
    );
}
