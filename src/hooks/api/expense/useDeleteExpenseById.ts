import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    DeleteExpenseDocument,
    DeleteExpenseMutation,
    DeleteExpenseMutationVariables,
    MyExpensesQuery,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from '../tasks/useGetMyAssignedTaskById';

export const useDeleteExpenseById = (id: string) => {
    const client = useQueryClient();
    return useMutation<DeleteExpenseMutation, Error, DeleteExpenseMutationVariables>({
        mutationFn: () => fetchGraphql(DeleteExpenseDocument, { id, taskId: '' }),
        onSuccess: (data, { taskId }) => {
            if (!data) return;

            const {
                deleteExpense: { expense: newExpense },
            } = data;

            if (taskId) {
                client.setQueryData<TaskByIdQuery>(
                    TASK_BY_ID_QUERY_KEY(taskId),
                    (oldData) => {
                        if (!oldData || !oldData.myAssignedTaskById) {
                            return oldData;
                        }
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
            } else {
                client.setQueryData<MyExpensesQuery>(['expenses'], (oldData) => {
                    if (!oldData || !oldData.myExpenses) return oldData;
                    if (!newExpense) return oldData;
                    const newData: MyExpensesQuery = {
                        ...oldData,
                        myExpenses: [
                            ...oldData.myExpenses.filter(
                                (expense) => expense.id !== newExpense.id,
                            ),
                        ],
                    };
                    return newData;
                });
            }
            showToast('Gasto Eliminado', 'success');
        },
        onError: (error) => {
            showToast(`Ocurrió un error: ${error}`, 'error');
        },
    });
};
