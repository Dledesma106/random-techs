import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    CreateExpenseDocument,
    CreateExpenseMutation,
    CreateExpenseMutationVariables,
    ExpenseStatus,
    MyExpensesQuery,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';
import { stringifyObject } from '@/lib/utils';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from '../tasks/useGetMyAssignedTaskById';

export const useCreateExpense = () => {
    const client = useQueryClient();
    return useMutation<CreateExpenseMutation, Error, CreateExpenseMutationVariables>({
        mutationFn: (data) => fetchGraphql(CreateExpenseDocument, data),
        onSuccess: (data, { taskId, expenseData }) => {
            if (!data) return;
            const {
                createExpense: { expense: newExpense },
            } = data;

            if (taskId) {
                client.setQueryData<TaskByIdQuery>(
                    TASK_BY_ID_QUERY_KEY(taskId),
                    (oldData) => {
                        if (!oldData?.myAssignedTaskById) return oldData;
                        if (!newExpense) return oldData;

                        return {
                            ...oldData,
                            myAssignedTaskById: {
                                ...oldData.myAssignedTaskById,
                                expenses: [
                                    ...oldData.myAssignedTaskById.expenses,
                                    {
                                        ...newExpense,
                                        amount: expenseData.amount,
                                        createdAt: new Date().toISOString(),
                                        registeredBy: {
                                            id: 'me',
                                            email: 'me',
                                            fullName: 'me',
                                        },
                                        status: ExpenseStatus.Enviado,
                                        images:
                                            expenseData.imageKeys?.map((key) => ({
                                                id: key,
                                                url: '',
                                                key: key,
                                                urlExpire: new Date().toISOString(),
                                            })) || [],
                                        files:
                                            expenseData.fileKeys?.map((key, index) => ({
                                                id: key,
                                                url: '',
                                                key: key,
                                                urlExpire: new Date().toISOString(),
                                                filename:
                                                    expenseData.filenames?.[index] || '',
                                                size: expenseData.sizes?.[index] || 0,
                                            })) || [],
                                    },
                                ],
                            },
                        };
                    },
                );
            } else {
                client.setQueryData<MyExpensesQuery>(['expenses'], (oldData) => {
                    if (!oldData?.myExpenses) return oldData;
                    if (!newExpense) return oldData;
                    return {
                        ...oldData,
                        myExpenses: [...oldData.myExpenses, newExpense],
                    };
                });
            }
            showToast('Gasto registrado', 'success');
        },
        onError: (error) => {
            console.log(stringifyObject(error));
            showToast(`Ocurrió un error: ${stringifyObject(error)}`, 'error');
        },
    });
};
