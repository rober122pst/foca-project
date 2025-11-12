import { useEffect, useState } from 'react';

/*
 * Hook pra saber o tamanho da tela
 */
export function useResponsive(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerHeight <= breakpoint);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
}
