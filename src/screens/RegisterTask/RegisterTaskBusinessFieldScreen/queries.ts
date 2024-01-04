import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { BusinessesDocument } from '@/api/graphql';

const BUSINESSES_QUERY_KEY = (branchId: string) => [
    'businesses',
    {
        branchId: branchId,
    },
];

const useBusinessesQuery = (branchId: string) => {
    return useQuery({
        queryKey: BUSINESSES_QUERY_KEY(branchId),
        queryFn: () => {
            return fetchGraphql(BusinessesDocument, {
                branch: branchId,
            });
        },
    });
};

export default useBusinessesQuery;
