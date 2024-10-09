import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from '../tasks/useGetMyAssignedTaskById';
import { TASKS_LIST_QUERY_KEY } from '../tasks/useGetMyAssignedTasks';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    CreateExpenseOnTaskDocument,
    CreateExpenseOnTaskMutation,
    CreateExpenseOnTaskMutationVariables,
    ExpenseStatus,
} from '@/api/graphql';
import Toast from 'react-native-root-toast';

export const useCreateExpenseOnTask = () => {
    const client = useQueryClient();
    return useMutation<
        CreateExpenseOnTaskMutation,
        Error,
        CreateExpenseOnTaskMutationVariables
    >({
        mutationFn: (data) => fetchGraphql(CreateExpenseOnTaskDocument, data),
        onSuccess: (data, { taskId, expenseData }) => {
            if (!data) return;

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(taskId),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }
                    const {
                        createExpenseOnTask: { expense: newExpense },
                    } = data;
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
                                    doneBy: {
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
                                },
                            ],
                        },
                    };
                    Toast.show('Gasto registrado', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                    });
                    return newData;
                },
            );
        },
        onError: (error) => {
            Toast.show(`Ocurrió un error: ${error}`, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        },
    });
};
