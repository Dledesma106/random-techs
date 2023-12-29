import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { ExpenseStatus, ExpenseType, PaySource } from '@/models/types';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQueryData } from '../Task/queries';

type UseUploadImageToExpenseMutation = {
    data: {
        _id: string;
        task: string;
        doneBy: string;
        expenseType: ExpenseType;
        paySource: PaySource;
        image: string;
        amount: number;
        status: ExpenseStatus;
    };
};
type UseUploadImageToExpenseMutationVariables = {
    taskId: string;
    expenseType: ExpenseType;
    paySource: PaySource;
    imageURI: string;
    amount: number;
};

export const postExpense = async (data: UseUploadImageToExpenseMutationVariables) => {
    const { taskId, expenseType, paySource, imageURI, amount } = data;

    const photoName = imageURI.split('/').pop();
    if (!photoName) {
        throw new Error('La imagen no tiene un nombre válido');
    }

    const formData = new FormData();
    formData.append('image', {
        uri: imageURI,
        name: photoName,
        type: 'image/jpeg',
    });
    formData.append('taskId', taskId);
    formData.append('expenseType', expenseType);
    formData.append('paySource', paySource);
    formData.append('amount', amount.toString());

    const response = await appAxios.post<UseUploadImageToExpenseMutation>(
        `/tech/expenses`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: (await JWTTokenService.get()) || '',
            },
        },
    );

    return response.data.data;
};

export const useCreateTaskExpenseMutation = () => {
    const client = useQueryClient();

    return useMutation<
        UseUploadImageToExpenseMutation['data'],
        AxiosError,
        UseUploadImageToExpenseMutationVariables
    >({
        mutationFn: postExpense,
        onSuccess: (data, variables) => {
            if (!data) {
                return;
            }

            client.setQueryData<TaskByIdQueryData>(
                TASK_BY_ID_QUERY_KEY(variables.taskId),
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    const newData: TaskByIdQueryData = {
                        ...oldData,
                        expenses: [
                            ...oldData.expenses,
                            {
                                ...data,
                                image: {
                                    url: variables.imageURI,
                                },
                            },
                        ],
                    };

                    return newData;
                },
            );
        },
    });
};
