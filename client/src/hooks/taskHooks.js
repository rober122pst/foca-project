import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, patchTask } from '../services/tasksService';

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask) => {
            console.log(newTask);
            return await createTask(newTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-overview']);
        },
    });
}

export function usePatchTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }) => {
            return await patchTask(id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-overview']);
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            return await deleteTask(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard-overview']);
        },
    });
}
