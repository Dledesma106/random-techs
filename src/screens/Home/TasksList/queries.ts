import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { TaskStatus, TaskType } from '@/models/types';

export type TasksListQueryDataIem = {
    _id: string;
    branch: {
        number: number;
        client: {
            name: string;
        };
    };
    business: {
        name: string;
    };
    openedAt: string;
    taskType: TaskType;
    status: TaskStatus;
    description: string;
    closedAt?: Date;
};

export type TasksListQuery = FetchTasks['data'];

type FetchTasks = {
    data: TasksListQueryDataIem[];
};

const fetchTasks = (filter: TasksListQueryFilters) => async () => {
    const searchParams = new URLSearchParams();

    if (filter.status) {
        if (Array.isArray(filter.status)) {
            filter.status.forEach((status) => {
                searchParams.append('status', status.toString());
            });
        } else {
            searchParams.append('status', filter.status.toString());
        }
    }

    const url = searchParams.size ? `/tech/tasks?${searchParams}` : '/tech/tasks';

    console.log(url);
    // console.log(typeof );
    console.log(searchParams.size);

    const response = await appAxios.get<FetchTasks>(`/tech/tasks?${searchParams}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });

    return response.data.data;
};

type TasksListQueryFilters = {
    status?: TaskStatus | TaskStatus[];
};

export const TASKS_LIST_QUERY_KEY = ['tasks'];

export const useTasksListQuery = (query: TasksListQueryFilters) => {
    return useQuery<TasksListQuery>({
        queryKey: TASKS_LIST_QUERY_KEY,
        queryFn: fetchTasks(query),
    });
};
