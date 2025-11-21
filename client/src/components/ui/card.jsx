import { twMerge } from 'tailwind-merge';

export function CardTitle({ children, className }) {
    return (
        <div
            className={twMerge(
                'text-items-950 dark:text-cream-100 flex items-center gap-1.5 text-lg font-extrabold',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return <div className={twMerge('flex justify-between px-4', className)}>{children}</div>;
}

export function CardContent({ children, className }) {
    return <div className={twMerge('dark:text-cream-100 flex flex-col gap-2', className)}>{children}</div>;
}

export function Card({ className, children }) {
    return (
        <div
            className={twMerge(
                'bg-cream-100 dark:bg-night-900 border-cream-300 dark:border-night-800 rounded-4xl border py-6',
                className
            )}
        >
            {children}
        </div>
    );
}
