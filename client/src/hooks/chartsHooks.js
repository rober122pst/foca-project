import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getTimeDistributionChart } from '../services/chartsService';

export function useTimeDistributionChart() {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['time-distribution', accessToken],
        queryFn: async () => {
            return await getTimeDistributionChart();
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
        enabled: !!accessToken,
    });
}
