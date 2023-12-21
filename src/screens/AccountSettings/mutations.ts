import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { RSA } from 'react-native-rsa-native';

import { appAxios } from '@/api/axios';
import { IUser } from '@/models/interfaces';

type LoginMutationVariables = {
    password: string;
    publicKey: string;
    currentPass: string;
};

type LoginMutationData = {
    data: {
        accessToken: string;
        user: IUser;
    };
};

const encryptPassword = async (password: string, publicKey: string) => {
    console.log('encriptando');
    console.log(password, publicKey);
    const encodedMessage = await RSA.encrypt(password, publicKey);
    console.log('encriptado finalizado');

    return encodedMessage;
};

const postPasswordCheck = async (password: string, publicKey: string) => {
    const response = await appAxios.post(`/auth/check-password`, {
        body: {
            currentPassword: await encryptPassword(password, publicKey),
        },
        headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
};

const changePassword = async (password: string, publicKey: string) => {
    const response = await appAxios.post(`/auth/check-password`, {
        body: {
            newPassword: await encryptPassword(password, publicKey),
        },
        headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
};
export const usePasswordChange = () => {
    return useMutation<LoginMutationData, AxiosError, LoginMutationVariables>({
        mutationFn: async ({ currentPass, password, publicKey }) => {
            await postPasswordCheck(currentPass, publicKey);
            return await changePassword(password, publicKey);
        },
    });
};
