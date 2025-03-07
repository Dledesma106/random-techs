import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASKS_LIST_QUERY_KEY } from './useGetMyAssignedTasks';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    CreateMyTaskDocument,
    CreateMyTaskMutation,
    CreateMyTaskMutationVariables,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';

export const useCreateMyTask = () => {
    const client = useQueryClient();
    return useMutation<CreateMyTaskMutation, Error, CreateMyTaskMutationVariables>({
        mutationFn: (data) => {
            return fetchGraphql(CreateMyTaskDocument, data);
        },
        onError: (error) => {
            console.error('Error al crear tarea:', error);
            showToast('Error al crear la tarea', 'error');
        },
        onSuccess: (data) => {
            if (!data.createMyTask.success) {
                console.log(data.createMyTask.message);
                showToast(data.createMyTask.message ?? 'Ocurrio un error', 'error');
                return;
            }

            // Forzar una recarga de la lista de tareas
            client.invalidateQueries({ queryKey: TASKS_LIST_QUERY_KEY });
            showToast('Tarea creada correctamente', 'success');
        },
    });
};
