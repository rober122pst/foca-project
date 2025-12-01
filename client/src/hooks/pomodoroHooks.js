import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPomodoroSession } from '../services/pomodoroService';

export function useCreatePomodoroSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await createPomodoroSession(data);
            return res;
        },
    });
}
