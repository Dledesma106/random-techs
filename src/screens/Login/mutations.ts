import { useNetInfo } from '@react-native-community/netinfo';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as Crypto from 'expo-crypto';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

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

async function hashPassword(password: string) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function verifyPassword(testPassword: string, originalHash: string) {
    const testHash = await hashPassword(testPassword);
    return testHash === originalHash;
}

const saveUserOnSecureStorage = async (user: LoginMutationVariables) => {
    const hashedUser = {
        email: user.email,
        password: hashPassword(user.password),
    };

    await setItemAsync('user', JSON.stringify(hashedUser));
};

const getUserFromSecureStorageByEmail = async (email: string) => {
    const userItem = await getItemAsync('user');
    if (!userItem) return null;

    const user = JSON.parse(userItem);
    if (user.email === email) {
        return user;
    }

    return null;
};

const loginOnline = async (data: LoginMutationVariables) => {
    const response = await appAxios.post<LoginMutationData>('/auth', {
        ...data,
        appRequest: true,
    });
    return response.data.data;
};

const loginOffline = async (data: LoginMutationVariables) => {
    const user = await getUserFromSecureStorageByEmail(data.email);
    if (!user) {
        throw new Error('El correo no fue encontrado. Intenta conectarte a internet.');
    }

    const isValidPassword = verifyPassword(data.password, user.password);
    if (!isValidPassword) {
        throw new Error('La contraseña es incorrecta. Intenta conectarte a internet.');
    }

    return user;
};

const login = (isConnected: boolean) => async (data: LoginMutationVariables) => {
    if (isConnected) {
        return await loginOnline(data);
    } else {
        return await loginOffline(data);
    }
};

export const useLoginMutation = () => {
    const netInfo = useNetInfo();

    return useMutation<LoginMutationData['data'], AxiosError, LoginMutationVariables>({
        mutationFn: login(netInfo.isConnected ?? false),
        onSuccess: (data, variables) => {
            saveUserOnSecureStorage(variables);
        },
    });
};
