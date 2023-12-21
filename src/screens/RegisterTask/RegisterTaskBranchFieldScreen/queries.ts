import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';

const BRANCHES_QUERY_KEY = ['branches'];

export type FetchBranchesBranchItem = {
    _id: string;
    city: {
        _id: string;
        name: string;
        province: {
            _id: string;
            name: string;
        };
    };
    client: {
        _id: string;
        name: string;
    };
    businesses: {
        _id: string;
        name: string;
    };
};

type FetchBranchesResponse = {
    data: FetchBranchesBranchItem[];
};

const fetchBranches = async () => {
    const { data } = await appAxios.get<FetchBranchesResponse>('/tech/branches', {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });
    return data.data;
};

const useBranchesQuery = () => {
    return useQuery({
        queryKey: BRANCHES_QUERY_KEY,
        queryFn: fetchBranches,
    });
};

export default useBranchesQuery;
