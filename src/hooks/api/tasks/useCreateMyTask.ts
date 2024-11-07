import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from './useGetMyAssignedTaskById';
import { TASKS_LIST_QUERY_KEY } from './useGetMyAssignedTasks';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    MyAssignedTasksQuery,
    CreateMyTaskDocument,
    CreateMyTaskMutation,
    CreateMyTaskMutationVariables,
} from '@/api/graphql';
import Toast from 'react-native-root-toast';

export const useCreateMyTask = () => {
    const client = useQueryClient();
    return useMutation<CreateMyTaskMutation, Error, CreateMyTaskMutationVariables>({
        mutationFn: (data) => {
            return fetchGraphql(CreateMyTaskDocument, data);
        },
        onError: (error) => console.log(error),
        onSuccess: (data, { input }) => {
            if (!data.createMyTask.success) {
                Toast.show(data.createMyTask.message ?? 'Ocurrio un error', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                });
                return;
            }

            const task = data.createMyTask.task;
            if (!task) {
                return;
            }

            client.setQueryData<MyAssignedTasksQuery>(TASKS_LIST_QUERY_KEY, (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                const newData: MyAssignedTasksQuery = {
                    ...oldData,
                    myAssignedTasks: [task, ...oldData.myAssignedTasks],
                };

                return newData;
            });

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(task.id),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }

                    const newData: TaskByIdQuery = {
                        ...oldData,
                        myAssignedTaskById: {
                            ...oldData.myAssignedTaskById,
                            status: task.status,
                            images: task.images,
                            expenses: task.expenses,
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
