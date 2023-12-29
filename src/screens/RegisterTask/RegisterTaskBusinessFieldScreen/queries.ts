import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';

const BUSINESSES_QUERY_KEY = (branchId: string) => [
    'businesses',
    {
        branchId: branchId,
    },
];

export type FetchBusinessesDataItem = {
    _id: string;
    name: string;
};

type FetchBusinessesResponse = {
    data: FetchBusinessesDataItem[];
};

const fetchBusinesses = (branchId: string) => async () => {
    const searchParams = new URLSearchParams();
    searchParams.append('branchId', branchId);

    const { data } = await appAxios.get<FetchBusinessesResponse>(
        `/tech/businesses?${searchParams}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: (await JWTTokenService.get()) || '',
            },
        },
    );
    return data.data;
};

const useBusinessesQuery = (branchId: string) => {
    return useQuery({
        queryKey: BUSINESSES_QUERY_KEY(branchId),
        queryFn: fetchBusinesses(branchId),
    });
};

export default useBusinessesQuery;
