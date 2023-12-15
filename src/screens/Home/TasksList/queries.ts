import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { ITask } from '@/models/interfaces';

type FetchTasks = {
    data: {
        tasks: ITask[];
    };
};

const fetchTasks = async () => {
    const response = await appAxios.get<FetchTasks>('/tech/tasks', {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });

    return response.data.data.tasks;
};

export const useTasksListQuery = () => {
    const { data, isPending, error, refetch } = useQuery<FetchTasks['data']['tasks']>({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
    });

    return {
        data,
        isPending,
        error,
        refetch,
    };
};
