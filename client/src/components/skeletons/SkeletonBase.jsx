import { twMerge } from 'tailwind-merge';

export function SkeletonBase({ className = '' }) {
    return <div className={twMerge('shimmer animate-pulse rounded', className)} />;
}
