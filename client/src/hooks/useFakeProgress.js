import { useEffect, useState } from 'react';

export function useFakeProgress(isLoading) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let interval;

        if (isLoading) {
            setProgress(0);

            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 90) {
                        return oldProgress;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 90);
                });
            }, 500);
        } else {
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 100) {
                        return oldProgress;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 50);
        }

        return () => clearInterval(interval);
    }, [isLoading]);

    return progress;
}
