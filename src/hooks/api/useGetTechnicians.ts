import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { TechniciansDocument } from '@/api/graphql';

export const TECHNICIANS_LIST_QUERY_KEY = ['technicians'];

export const useGetTechnicians = () => {
    return useQuery({
        queryKey: TECHNICIANS_LIST_QUERY_KEY,
        queryFn: () => fetchGraphql(TechniciansDocument, {}),
    });
};
