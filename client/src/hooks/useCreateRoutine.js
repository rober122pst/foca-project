import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoutine } from '../services/routinesService';

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
