import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyExpenseByIdDocument } from '@/api/graphql';

export const useGetExpenseById = (id: string) => {
    return useQuery({
        queryKey: ['expenses', 'detail', id],
        queryFn: () => fetchGraphql(MyExpenseByIdDocument, { id }),
        enabled: !!id,
    });
};
