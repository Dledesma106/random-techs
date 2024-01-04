import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyAssignedTasksDocument } from '@/api/graphql';

export const TASKS_LIST_QUERY_KEY = ['tasks'];

export const useTasksListQuery = () => {
    return useQuery({
        queryKey: TASKS_LIST_QUERY_KEY,
        queryFn: () => fetchGraphql(MyAssignedTasksDocument, {}),
    });
};
