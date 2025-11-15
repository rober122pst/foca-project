import { twMerge } from 'tailwind-merge';

export default function Button({ children, className, variant = 'default' }) {
    let _class;
    switch (variant) {
        case 'outline':
            _class = 'bg-cream-100 dark:bg-night-800 border-cream-300 dark:border-night-700 border';
            break;
        default:
            _class = 'bg-items-500 text-cream-100';
            break;
    }

    return (
        <button className={twMerge('cursor-pointer hover:opacity-75 disabled:cursor-not-allowed', _class, className)}>
            {children}
        </button>
    );
}
