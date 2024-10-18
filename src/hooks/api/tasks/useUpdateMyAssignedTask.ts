import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from './useGetMyAssignedTaskById';
import { TASKS_LIST_QUERY_KEY } from './useGetMyAssignedTasks';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    MyAssignedTasksQuery,
    UpdateMyAssignedTaskDocument,
    UpdateMyAssignedTaskMutation,
    UpdateMyAssignedTaskMutationVariables,
} from '@/api/graphql';

export const useUpdateMyAssignedTask = () => {
    const client = useQueryClient();
    return useMutation<
        UpdateMyAssignedTaskMutation,
        Error,
        UpdateMyAssignedTaskMutationVariables
    >({
        mutationFn: (data) => {
            return fetchGraphql(UpdateMyAssignedTaskDocument, data);
        },
        onError: (error) => console.log(error),
        onSuccess: (data, variables) => {
            const task = data.updateMyAssignedTask.task;
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
                        if (someTask.id !== variables.input.id) {
                            return someTask;
                        }

                        return {
                            ...someTask,
                            status: task.status,
                            observations: task.observations,
                            closedAt: task.closedAt,
                            images: task.images,
                            workOrderNumber: task.workOrderNumber,
                        };
                    }),
                };

                return newData;
            });

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(variables.input.id),
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
            client.invalidateQueries({
                queryKey: ['tasks', 'detail', task.id],
            });
        },
    });
};
