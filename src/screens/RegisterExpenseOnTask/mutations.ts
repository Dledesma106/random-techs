import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { compressedImageToFormData, getCompressedImageAsync } from '@/lib/utils';
import { ExpenseStatus, ExpenseType, PaySource } from '@/models/types';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from '../Task/queries';

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

    const { image, filename } = await getCompressedImageAsync(imageURI);

    const formData = new FormData();
    formData.append('image', compressedImageToFormData({ image, filename }));
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
                Authorization: (await JWTTokenService.getAsync()) || '',
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

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(variables.taskId),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }

                    const newData: TaskByIdQuery = {
                        ...oldData,
                        myAssignedTaskById: {
                            ...oldData.myAssignedTaskById,
                            expenses: [
                                ...oldData.myAssignedTaskById.expenses,
                                {
                                    amount: variables.amount,
                                    createdAt: new Date().toISOString(),
                                    doneBy: {
                                        id: 'me',
                                        email: 'me',
                                        fullName: 'me',
                                    },
                                    id: data._id,
                                    paySource: variables.paySource,
                                    status: ExpenseStatus.Enviado,
                                    image: {
                                        id: variables.imageURI,
                                        url: variables.imageURI,
                                        key: variables.imageURI,
                                        urlExpire: new Date().toISOString(),
                                    },
                                },
                            ],
                        },
                    };

                    return newData;
                },
            );
        },
    });
};
