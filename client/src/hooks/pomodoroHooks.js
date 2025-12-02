import { useMutation, useQuery } from '@tanstack/react-query';
import { createPomodoroSession, getPomodoroSession, pomodoroStart } from '../services/pomodoroService';

import { useAuth } from '../contexts/AuthContext';

export function useCreatePomodoroSession() {
    return useMutation({
        mutationFn: async (data) => {
            const res = await createPomodoroSession(data);
            return res;
        },
    });
}

export function usePomodoroSession(id) {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['pomodoro-session', accessToken],
        queryFn: () => getPomodoroSession(id),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
        enabled: !!accessToken,
    });
}

export function useStartPomodoro(id) {
    const { accessToken } = useAuth();

    return useQuery({
        queryKey: ['start-pomodoro', accessToken],
        queryFn: () => pomodoroStart(id),
        enabled: false,
    });
}
