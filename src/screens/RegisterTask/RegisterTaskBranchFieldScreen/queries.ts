import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { BranchesDocument } from '@/api/graphql';

const BRANCHES_QUERY_KEY = ['branches'];

const useBranchesQuery = () => {
    return useQuery({
        queryKey: BRANCHES_QUERY_KEY,
        queryFn: () => fetchGraphql(BranchesDocument, {}),
    });
};

export default useBranchesQuery;
