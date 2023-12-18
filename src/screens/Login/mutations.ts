import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';
import { IUser } from '@/models/interfaces';

type LoginMutationVariables = {
    email: string;
    password: string;
};

type LoginMutationData = {
    data: {
        accessToken: string;
        user: IUser;
    };
};

const loginOnline = async (data: LoginMutationVariables) => {
    const response = await appAxios.post<LoginMutationData>('/auth', {
        ...data,
        appRequest: true,
    });
    return response.data.data;
};

const login = async (data: LoginMutationVariables) => {
    return await loginOnline(data);
};

export const useLoginMutation = () => {
    return useMutation<LoginMutationData['data'], AxiosError, LoginMutationVariables>({
        mutationFn: login,
    });
};
