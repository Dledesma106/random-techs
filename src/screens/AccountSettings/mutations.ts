import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { createAppAxiosAsync } from '@/api/axios';
import { IUser } from '@/models/interfaces';

type LoginMutationVariables = {
    currentPassword: string;
    newPassword: string;
};

type LoginMutationData = {
    data: {
        accessToken: string;
        user: IUser;
    };
};

const changePassword = async ({
    currentPassword,
    newPassword,
}: LoginMutationVariables) => {
    const response = await (
        await createAppAxiosAsync()
    ).post(
        `/auth/change-password`,
        {
            currentPassword,
            newPassword,
        },
        { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
};
export const usePasswordChange = () => {
    return useMutation<LoginMutationData, AxiosError, LoginMutationVariables>({
        mutationFn: async (data) => {
            const res = await changePassword(data);
            return res;
        },
    });
};
