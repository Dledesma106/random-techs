import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from './queries';

import { createAppAxiosAsync } from '@/api/axios';
import { fetchGraphql } from '@/api/fetch-graphql';
import {
    MyAssignedTasksQuery,
    UpdateMyAssignedTaskDocument,
    UpdateMyAssignedTaskMutation,
    UpdateMyAssignedTaskMutationVariables,
} from '@/api/graphql';
import { compressedImageToFormData, getCompressedImageAsync } from '@/lib/utils';

import { TASKS_LIST_QUERY_KEY } from '../Home/TasksList/queries';

type UseUploadImageToTaskMutation = { data: string };
type UseUploadImageToTaskMutationVariables = {
    taskId: string;
    localURI: string;
};

export const postImageToTask = async (data: UseUploadImageToTaskMutationVariables) => {
    const { localURI, taskId } = data;

    const { image, filename } = await getCompressedImageAsync(localURI);

    const formData = new FormData();
    formData.append('image', compressedImageToFormData({ image, filename }));

    const response = await (
        await createAppAxiosAsync()
    ).post<UseUploadImageToTaskMutation>(`/images?taskId=${taskId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

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
            const previousData = client.getQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(variables.taskId),
            );

            if (previousData) {
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
                                images: [
                                    ...oldData.myAssignedTaskById.images,
                                    {
                                        id: variables.localURI,
                                        url: variables.localURI,
                                        unsaved: true,
                                    },
                                ],
                            },
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
                            images: oldData.myAssignedTaskById.images.map((image) => {
                                if (image.id !== variables.localURI) {
                                    return image;
                                }

                                return {
                                    ...image,
                                    _id: variables.localURI,
                                    url: variables.localURI,
                                    unsaved: false,
                                };
                            }),
                        },
                    };

                    return newData;
                },
            );
        },
    });
};

export const useTaskUpdateMutation = () => {
    const client = useQueryClient();
    return useMutation<
        UpdateMyAssignedTaskMutation,
        Error,
        UpdateMyAssignedTaskMutationVariables
    >({
        mutationFn: (data) => {
            return fetchGraphql(UpdateMyAssignedTaskDocument, data);
        },
        onSuccess: (data, variables) => {
            const task = data.updateMyAssignedTask.task;
            console.log('task', task);
            if (!task) {
                return;
            }

            client.setQueryData<MyAssignedTasksQuery>(TASKS_LIST_QUERY_KEY, (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                const newData: MyAssignedTasksQuery = {
                    ...oldData,
                    myAssignedTasks: oldData.myAssignedTasks.map((someTask) => {
                        if (someTask.id !== variables.id) {
                            return someTask;
                        }

                        return {
                            ...someTask,
                            status: task.status,
                            // TODO: Take into account the unsaved images
                            images: task.images,
                            workOrderNumber: task.workOrderNumber,
                        };
                    }),
                };

                return newData;
            });

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(variables.id),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }

                    const newData: TaskByIdQuery = {
                        ...oldData,
                        myAssignedTaskById: {
                            ...oldData.myAssignedTaskById,
                            status: task.status,
                            // TODO: Take into account the unsaved images
                            images: task.images,
                            workOrderNumber: task.workOrderNumber,
                        },
                    };

                    return newData;
                },
            );
        },
    });
};
