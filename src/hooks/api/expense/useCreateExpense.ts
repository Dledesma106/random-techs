import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-root-toast';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    CreateExpenseDocument,
    CreateExpenseMutation,
    CreateExpenseMutationVariables,
    ExpenseStatus,
    MyExpensesQuery,
} from '@/api/graphql';

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
                        if (!oldData || !oldData.myAssignedTaskById) {
                            return oldData;
                        }
                        if (!newExpense) return oldData;
                        const newData: TaskByIdQuery = {
                            ...oldData,
                            myAssignedTaskById: {
                                ...oldData.myAssignedTaskById,
                                expenses: [
                                    ...oldData.myAssignedTaskById.expenses,
                                    {
                                        amount: expenseData.amount,
                                        createdAt: new Date().toISOString(),
                                        registeredBy: {
                                            id: 'me',
                                            email: 'me',
                                            fullName: 'me',
                                        },
                                        id: newExpense.id,
                                        paySource: expenseData.paySource,
                                        expenseType: expenseData.expenseType,
                                        status: ExpenseStatus.Enviado,
                                        image: {
                                            id: newExpense.image.id,
                                            url: newExpense.image.url,
                                            key: newExpense.image.key,
                                            urlExpire: new Date().toISOString(),
                                        },
                                        paySourceBank: newExpense.paySourceBank,
                                        doneBy: newExpense.doneBy,
                                        observations: newExpense.observations,
                                    },
                                ],
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
                        myExpenses: [...oldData.myExpenses, newExpense],
                    };
                    return newData;
                });
            }
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
