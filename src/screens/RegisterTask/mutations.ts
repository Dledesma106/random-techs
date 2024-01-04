import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    CreateTaskDocument,
    CreateTaskMutation,
    CreateTaskMutationVariables,
} from '@/api/graphql';

import { TASKS_LIST_QUERY_KEY } from '../Home/TasksList/queries';

type Options = UseMutationOptions<
    CreateTaskMutation,
    AxiosError,
    CreateTaskMutationVariables
>;

export const useCreateTaskMutation = ({ onSuccess, ...options }: Options) => {
    const client = useQueryClient();
    return useMutation<CreateTaskMutation, AxiosError, CreateTaskMutationVariables>({
        mutationFn: (data) => fetchGraphql(CreateTaskDocument, data),
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
