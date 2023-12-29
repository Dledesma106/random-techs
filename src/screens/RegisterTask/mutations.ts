import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';
import { TaskType } from '@/models/types';

import { TASKS_LIST_QUERY_KEY } from '../Home/TasksList/queries';

type CreateTaskRequestData = { data: string };
type CreateTaskMutationVariables = {
    branch: string;
    business: string;
    taskType: TaskType;
    description: string;
    workOrderNumber: number;
};

type UseTaskUpdateMutation = string;

const postTask = async (data: CreateTaskMutationVariables) => {
    const response = await appAxios.post<CreateTaskRequestData>('/tech/tasks', data, {
        timeout: 8000,
    });
    return response.data.data;
};

type Options = UseMutationOptions<
    UseTaskUpdateMutation,
    AxiosError,
    CreateTaskMutationVariables
>;

export const useCreateTaskMutation = ({ onSuccess, ...options }: Options) => {
    const client = useQueryClient();
    return useMutation<UseTaskUpdateMutation, AxiosError, CreateTaskMutationVariables>({
        mutationFn: postTask,
        onSuccess: (data, variables, context) => {
            if (!data) {
                return;
            }

            client.invalidateQueries({
                queryKey: TASKS_LIST_QUERY_KEY,
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        retry: false,
        ...options,
    });
};
