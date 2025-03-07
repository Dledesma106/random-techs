import { useMutation } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { LoginDocument, LoginMutation, LoginMutationVariables } from '@/api/graphql';

const useLogin = () => {
    return useMutation<LoginMutation, Error, LoginMutationVariables>({
        mutationFn: (data) => fetchGraphql(LoginDocument, data),
    });
};

export default useLogin;
