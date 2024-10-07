import { useMutation } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import { LoginDocument, LoginMutation, LoginMutationVariables } from '@/api/graphql';
import JWTTokenService from '@/lib/JWTTokenService';
import { useUserContext } from '@/context/userContext/useUser';
import { Alert } from 'react-native';

const useLogin = () => {
    return useMutation<LoginMutation, Error, LoginMutationVariables>({
        mutationFn: (data) => fetchGraphql(LoginDocument, data),
    });
};

export default useLogin;
