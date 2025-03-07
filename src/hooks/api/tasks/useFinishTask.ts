import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASKS_LIST_QUERY_KEY } from './useGetMyAssignedTasks';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    FinishTaskDocument,
    FinishTaskMutation,
    FinishTaskMutationVariables,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';

export const useFinishTask = () => {
    const client = useQueryClient();
    return useMutation<FinishTaskMutation, Error, FinishTaskMutationVariables>({
        mutationFn: (data) => fetchGraphql(FinishTaskDocument, data),
        onSuccess: (data, _variables) => {
            if (!data) return;
            const {
                finishTask: { success, message, task },
            } = data;

            if (success && task) {
                // Forzar una recarga de la lista de tareas
                client.invalidateQueries({ queryKey: TASKS_LIST_QUERY_KEY });
                showToast(message || 'Tarea finalizada correctamente', 'success');
            } else {
                throw new Error(message || 'No se pudo finalizar la tarea');
            }
        },
        onError: (error) => {
            console.error('Error al finalizar tarea:', error);
            showToast(`Ocurrió un error al finalizar la tarea`, 'error');
        },
    });
};
