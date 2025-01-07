import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { BranchBusinessesDocument, BranchBusinessesQuery } from '@/api/graphql';

export const useGetBusinessesOptions = (branch: string) => {
    return useQuery<unknown, Error, BranchBusinessesQuery>({
        queryKey: ['tasks', 'businesses', branch],
        queryFn: () => fetchGraphql(BranchBusinessesDocument, { branch }),
    });
};
