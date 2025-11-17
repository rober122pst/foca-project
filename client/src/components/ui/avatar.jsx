import { twMerge } from 'tailwind-merge';

// Container do avatar
export function Avatar({ className, children }) {
    return (
        <span className={twMerge('flex size-8 h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
            {children}
        </span>
    );
}

//  Imagem do avatar
export function AvatarImage({ src, alt, className }) {
    return <img className={twMerge('aspect-square size-full', className)} src={src} alt={alt} />;
}

// Caso a imagem falhe em carregar
export function AvatarFallback({ className, children }) {
    return (
        <div
            className={twMerge(
                'bg-cream-200 text-items-500 dark:bg-night-800 dark:text-cream-500 flex h-full w-full items-center justify-center text-2xl',
                className
            )}
        >
            {children}
        </div>
    );
}
