import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    DeleteExpenseDocument,
    DeleteExpenseMutation,
    DeleteExpenseMutationVariables,
} from '@/api/graphql';
import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from '../tasks/useGetMyAssignedTaskById';
import Toast from 'react-native-root-toast';

export const useDeleteExpenseById = (id: string) => {
    const client = useQueryClient();
    return useMutation<DeleteExpenseMutation, Error, DeleteExpenseMutationVariables>({
        mutationFn: () => fetchGraphql(DeleteExpenseDocument, { id, taskId: '' }),
        onSuccess: (data, { id, taskId }) => {
            if (!data) return;

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(taskId),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }
                    const {
                        deleteExpense: { expense: newExpense },
                    } = data;
                    if (!newExpense) return oldData;
                    const newData: TaskByIdQuery = {
                        ...oldData,
                        myAssignedTaskById: {
                            ...oldData.myAssignedTaskById,
                            expenses: oldData.myAssignedTaskById.expenses.filter(
                                (expense) => expense.id !== newExpense.id,
                            ),
                        },
                    };
                    return newData;
                },
            );
            Toast.show('Gasto registrado', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        },
        onError: (error) => {
            Toast.show(`Ocurrió un error: ${error}`, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        },
    });
};
