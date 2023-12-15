import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type UseUploadImageToTaskMutation = unknown;
type UseUploadImageToTaskMutationVariables = {
    taskId: string;
    localURI: string;
};

export const postImageToTask = async (data: UseUploadImageToTaskMutationVariables) => {
    const { localURI, taskId } = data;

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

    const response = await axios.post<UseUploadImageToTaskMutation>(
        `/images?taskId=${taskId}`,
        data.localURI,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return response.data;
};

export const useUploadImageToTaskMutation = () => {
    const client = useQueryClient();

    return useMutation<
        UseUploadImageToTaskMutation,
        AxiosError,
        UseUploadImageToTaskMutationVariables
    >({
        mutationFn: postImageToTask,
    });
};
