import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { IActivity } from '@/models/interfaces';
import { TaskStatus } from '@/models/types';

type FetchActivities = {
    data: IActivity[];
};

const fetchActivities = (filter: Filters) => async () => {
    const urlWithFilters = new URLSearchParams(filter).toString();
    const response = await appAxios.get<FetchActivities>(
        `/tech/activities?${urlWithFilters}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: (await JWTTokenService.get()) || '',
            },
        },
    );

    return response.data.data;
};

type Filters = {
    status?: TaskStatus;
};

export const useActivitiesListQuery = (query: Filters) => {
    return useQuery<FetchActivities['data']>({
        queryKey: ['activities'],
        queryFn: fetchActivities(query),
    });
};
