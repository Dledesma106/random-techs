import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { TaskTypesDocument } from '@/api/graphql';

export const TASK_TYPE_LIST_QUERY_KEY = ['taskTypes'];

export const useGetTaskTypes = () => {
    return useQuery({
        queryKey: TASK_TYPE_LIST_QUERY_KEY,
        queryFn: () => fetchGraphql(TaskTypesDocument, {}),
    });
};
