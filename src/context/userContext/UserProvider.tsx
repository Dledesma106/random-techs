import { useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { useState, PropsWithChildren, useEffect } from 'react';

import UserContext from './UserContext';

import { LoginMutation } from '@/api/graphql';
import JWTTokenService from '@/lib/JWTTokenService';
import { ProfileScreenRouteProp } from '@/navigation/types';

async function hashPassword(password: string) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

const saveUserOnSecureStorage = async (
    user: NonNullable<LoginMutation['login']['user']>,
    password: string,
) => {
    const hashedUser = {
        ...user,
        password: hashPassword(password),
    };

    await setItemAsync('user', JSON.stringify(hashedUser));
};

const getUserFromSecureStorage = async () => {
    const user = await getItemAsync('user');
    return user ? JSON.parse(user) : null;
};

const deleteUserDataFromSecureStorage = async () => {
    deleteItemAsync('user');
};

const UserProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<LoginMutation['login']['user'] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.clear();
        getUserFromSecureStorage()
            .then((user) => {
                if (user) {
                    setUser(user);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const loginUser = async (
        user: NonNullable<LoginMutation['login']['user']>,
        password: string,
    ) => {
        saveUserOnSecureStorage(user, password);
        setUser(user);
    };

    function isLoggedIn() {
        return user !== null;
    }

    function logoutUser(navigation: ProfileScreenRouteProp['navigation']) {
        setUser(null);
        queryClient.clear();
        deleteUserDataFromSecureStorage();
        JWTTokenService.deleteAsync();

        if (!navigation) {
            return;
        }

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return (
        <UserContext.Provider
            value={{
                user,
                logoutUser,
                isLoggedIn,
                setUser: loginUser,
            }}
        >
            {isLoading ? null : children}
        </UserContext.Provider>
    );
};

export default UserProvider;
