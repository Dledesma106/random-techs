import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { appAxios } from '@/api/axios';
import { IUser } from '@/models/interfaces';

type UserMutationVariables = {
    email: string;
    password: string;
};

type UserMutationData = {
    data: {
        accessToken: string;
        user: IUser;
    };
};

const loginOnline = async (data: UserMutationVariables) => {
    const response = await appAxios.post<UserMutationData>('/auth', {
        ...data,
        appRequest: true,
    });
    return response.data.data;
};

const login = async (data: UserMutationVariables) => {
    return await loginOnline(data);
};

export const useLoginMutation = () => {
    return useMutation<UserMutationData['data'], AxiosError, UserMutationVariables>({
        mutationFn: login,
    });
};
