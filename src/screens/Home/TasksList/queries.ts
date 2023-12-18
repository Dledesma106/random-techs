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

type FetchTasks = {
    data: TasksListQueryDataIem[];
};

const fetchTasks = (filter: TasksListQueryFilters) => async () => {
    const urlWithFilters = new URLSearchParams(filter).toString();
    const response = await appAxios.get<FetchTasks>(`/tech/tasks?${urlWithFilters}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });

    return response.data.data;
};

type TasksListQueryFilters = {
    status?: TaskStatus;
};

export const useTasksListQuery = (query: TasksListQueryFilters) => {
    return useQuery<FetchTasks['data']>({
        queryKey: ['tasks'],
        queryFn: fetchTasks(query),
    });
};
