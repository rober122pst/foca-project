import { twMerge } from 'tailwind-merge';

export function ProgressBar({ className, progress = 0, color = 'bg-cream-100' }) {
    return (
        <div className={twMerge(`${color}/25 h-1 w-full overflow-hidden rounded-md`, className)}>
            <div className={`${color} h-full`} style={{ width: `${progress}%` }}></div>
        </div>
    );
}
