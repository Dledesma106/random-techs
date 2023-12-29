import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQueryData } from './queries';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';

import { TASKS_LIST_QUERY_KEY, TasksListQuery } from '../Home/TasksList/queries';

type UseUploadImageToTaskMutation = { data: string };
type UseUploadImageToTaskMutationVariables = {
    taskId: string;
    localURI: string;
};

const createImageFormData = (localURI: string) => {
    const photoName = localURI.split('/').pop();
    if (!photoName) {
        throw new Error('La imagen no tiene un nombre válido');
    }

    return {
        uri: localURI,
        name: photoName,
        type: 'image/jpeg',
    };
};

export const postImageToTask = async (data: UseUploadImageToTaskMutationVariables) => {
    const { localURI, taskId } = data;

    const photoName = localURI.split('/').pop();
    if (!photoName) {
        throw new Error('La imagen no tiene un nombre válido');
    }

    const formData = new FormData();
    const imageData = createImageFormData(localURI);
    formData.append('image', imageData);

    const response = await appAxios.post<UseUploadImageToTaskMutation>(
        `/images?taskId=${taskId}`,
        formData,
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
        onMutate: async (variables) => {
            const previousData = client.getQueryData<TaskByIdQueryData>(
                TASK_BY_ID_QUERY_KEY(variables.taskId),
            );

            if (previousData) {
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
                                    _id: variables.localURI,
                                    url: variables.localURI,
                                    unsaved: true,
                                },
                            ],
                        };

                        return newData;
                    },
                );
            }

            return { previousData };
        },
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
                        images: oldData.images.map((image) => {
                            if (image._id !== variables.localURI) {
                                return image;
                            }

                            return {
                                ...image,
                                _id: variables.localURI,
                                url: variables.localURI,
                                unsaved: false,
                            };
                        }),
                    };

                    return newData;
                },
            );
        },
    });
};

type UseTaskUpdateMutation = {
    data: TaskByIdQueryData;
};
type UseTaskUpdateMutationVariables = {
    taskId: string;
    isClosed?: boolean;
    workOrder?: string;
    imageIdToDelete?: string;
};

export const putTaskUpdate = async (data: UseTaskUpdateMutationVariables) => {
    const response = await appAxios.put<UseTaskUpdateMutation>(
        `/tech/tasks/${data.taskId}`,
        {
            isClosed: data.isClosed,
            workOrder: data.workOrder,
            imageIdToDelete: data.imageIdToDelete,
        },
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: (await JWTTokenService.get()) || '',
            },
        },
    );

    return response.data;
};

export const useTaskUpdateMutation = () => {
    const client = useQueryClient();
    return useMutation<UseTaskUpdateMutation, AxiosError, UseTaskUpdateMutationVariables>(
        {
            mutationFn: putTaskUpdate,
            onSuccess: (data, variables) => {
                if (!data) {
                    return;
                }

                client.setQueryData<TasksListQuery>(TASKS_LIST_QUERY_KEY, (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    const newData: TasksListQuery = oldData.map((task) => {
                        if (task._id !== variables.taskId) {
                            return task;
                        }

                        return {
                            ...task,
                            status: data.data.status,
                        };
                    });

                    return newData;
                });

                client.setQueryData<TaskByIdQueryData>(
                    TASK_BY_ID_QUERY_KEY(variables.taskId),
                    (oldData) => {
                        if (!oldData) {
                            return oldData;
                        }

                        const newData: TaskByIdQueryData = data.data;

                        return newData;
                    },
                );
            },
        },
    );
};
