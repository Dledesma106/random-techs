import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';

const BUSINESSES_QUERY_KEY = ['businesses'];

export type FetchBusinessesDataItem = {
    _id: string;
    name: string;
};

type FetchBusinessesResponse = {
    data: FetchBusinessesDataItem[];
};

const fetchBusinesses = async () => {
    const { data } = await appAxios.get<FetchBusinessesResponse>('/tech/businesses', {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });
    return data.data;
};

const useBusinessesQuery = () => {
    return useQuery({
        queryKey: BUSINESSES_QUERY_KEY,
        queryFn: fetchBusinesses,
    });
};

export default useBusinessesQuery;
