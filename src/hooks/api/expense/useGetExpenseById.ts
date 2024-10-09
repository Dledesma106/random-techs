import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyAssignedTaskExpenseByIdDocument } from '@/api/graphql';

export const useGetExpenseById = (id: string) => {
    return useQuery({
        queryKey: ['expenses', 'detail', id],
        queryFn: () => fetchGraphql(MyAssignedTaskExpenseByIdDocument, { id }),
        enabled: !!id,
    });
};
