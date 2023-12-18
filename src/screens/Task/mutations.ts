import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQueryData } from './queries';

import { appAxios } from '@/api/axios';

type UseUploadImageToTaskMutation = string;
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

    const response = await appAxios.post<UseUploadImageToTaskMutation>(
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
                        images: [
                            ...oldData.images,
                            {
                                url: variables.localURI,
                            },
                        ],
                    };

                    return newData;
                },
            );
        },
    });
};
