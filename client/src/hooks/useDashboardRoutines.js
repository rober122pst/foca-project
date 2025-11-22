import { getRoutinesDash } from '../services/dashboardService';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

export function useDashboardRoutines() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['dashboard-routines', accessToken],
        queryFn: async () => {
            const res = await getRoutinesDash();
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
        enabled: !!accessToken,
    });
}
