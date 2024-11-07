import { useQuery } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { ClientsDocument } from '@/api/graphql';

export const CLIENT_LIST_QUERY_KEY = ['clients'];

export const useGetClients = () => {
    return useQuery({
        queryKey: CLIENT_LIST_QUERY_KEY,
        queryFn: () => fetchGraphql(ClientsDocument, {}),
    });
};
