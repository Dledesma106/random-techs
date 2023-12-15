import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';

type UseUploadImageToExpenseMutation = unknown;
type UseUploadImageToExpenseMutationVariables = {
    expenseId: string;
    localURI: string;
};

export const postImageToExpense = async (
    data: UseUploadImageToExpenseMutationVariables,
) => {
    const { localURI, expenseId } = data;

    const photoName = localURI.split('/').pop();
    if (!photoName) {
        throw new Error('La imagen no tiene un nombre válido');
    }

    const formData = new FormData();
    formData.append('image', {
        uri: localURI,
        name: photoName,
        type: 'image/jpeg',
    });

    const response = await appAxios.post<UseUploadImageToExpenseMutation>(
        `/images?expenseId=${expenseId}`,
        data.localURI,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return response.data;
};

export const useUploadImageToExpenseMutation = () => {
    const client = useQueryClient();

    return useMutation<
        UseUploadImageToExpenseMutation,
        AxiosError,
        UseUploadImageToExpenseMutationVariables
    >({
        mutationFn: postImageToExpense,
    });
};
