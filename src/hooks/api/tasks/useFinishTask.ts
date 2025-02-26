import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_BY_ID_QUERY_KEY } from './useGetMyAssignedTaskById';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    FinishTaskDocument,
    FinishTaskMutation,
    FinishTaskMutationVariables,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';
import { stringifyObject } from '@/lib/utils';

export const useFinishTask = () => {
    const client = useQueryClient();
    return useMutation<FinishTaskMutation, Error, FinishTaskMutationVariables>({
        mutationFn: (data) => fetchGraphql(FinishTaskDocument, data),
        onSuccess: (data, { id }) => {
            if (!data) return;
            const {
                finishTask: { success, message },
            } = data;

            if (success) {
                client.invalidateQueries({ queryKey: TASK_BY_ID_QUERY_KEY(id) });
                showToast(message || 'Tarea finalizada', 'success');
            } else {
                showToast(message || 'No se pudo finalizar la tarea', 'error');
            }
        },
        onError: (error) => {
            console.log(stringifyObject(error));
            showToast(`Ocurrió un error: ${stringifyObject(error)}`, 'error');
        },
    });
};
