import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoutine } from '../services/routinesService';
import { getRoutineById } from '../services/routinesService';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export function useRoutineById(id) {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: [`routine-${id}`, accessToken],
        queryFn: async () => {
            const res = await getRoutineById(id);
            return res.data;
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
        enabled: !!accessToken,
    });
}

export function useCreateRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newRoutine) => {
            return await createRoutine(newRoutine);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-routines']);
        },
    });
}
