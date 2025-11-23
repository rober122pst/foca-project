import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTask } from '../services/routinesService';

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask) => {
            return await createTask(newTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-routines']);
        },
    });
}
