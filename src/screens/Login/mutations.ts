import { useMutation } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { LoginDocument, LoginMutation, LoginMutationVariables } from '@/api/graphql';

export const useLoginMutation = () => {
    return useMutation<LoginMutation, Error, LoginMutationVariables>({
        mutationFn: (data) => fetchGraphql(LoginDocument, data),
    });
};
