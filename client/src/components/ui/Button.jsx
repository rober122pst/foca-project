import { twMerge } from 'tailwind-merge';

export default function Button({ children, className = '', variant = 'default' }) {
    let _class;
    switch (variant) {
        case 'outline':
            _class =
                'bg-cream-100 dark:bg-night-800 hover:bg-cream-200/70 hover:dark:bg-night-800/70 border-cream-300 dark:border-night-700 border';
            break;
        case 'ghost':
            _class = 'bg-transparent hover:opacity-70';
            break;
        default:
            _class = 'bg-items-500 text-cream-100 hover:bg-items-500/70';
            break;
    }

    return (
        <button
            className={twMerge(
                // eslint-disable-next-line quotes
                "display-center utline-none aria-invalid:ring-destructive/20 h-9 shrink-0 cursor-pointer gap-2 rounded-md px-4 py-2 text-center align-middle text-sm font-medium whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[>svg]:px-3 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
                _class,
                className
            )}
        >
            {children}
        </button>
    );
}
