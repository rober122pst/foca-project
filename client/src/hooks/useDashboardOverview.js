import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getOverview } from '../services/dashboardService';

export function useDashboardOverview() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['dashboard-overview', accessToken],
        queryFn: async () => {
            const res = await getOverview(accessToken);
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        enabled: !!accessToken,
    });
}
