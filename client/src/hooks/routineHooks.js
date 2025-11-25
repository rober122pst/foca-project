import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutine, deleteRoutine, getRoutineById, patchRoutine } from '../services/routinesService';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

export function useRoutineById(id) {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['routine', accessToken],
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

export function usePatchRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }) => {
            return await patchRoutine(id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-routines']);
            queryClient.invalidateQueries(['routine']);
        },
    });
}

export function useDeleteRoutine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            return await deleteRoutine(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-routines']);
            queryClient.invalidateQueries(['routine']);
        },
    });
}
