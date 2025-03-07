import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { MyExpensesDocument } from '@/api/graphql';

export const EXPENSES_LIST_QUERY_KEY = ['expenses'];

export const useGetMyExpenses = () => {
    return useQuery({
        queryKey: EXPENSES_LIST_QUERY_KEY,
        queryFn: () => fetchGraphql(MyExpensesDocument, {}),
    });
};
