import { useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { useState, PropsWithChildren, useEffect } from 'react';

import UserContext from './UserContext';

import JWTTokenService from '@/lib/JWTTokenService';

import { IUser } from '../../models/interfaces';

export interface ILoginJson {
    user: IUser;
    accessToken: string;
}

async function hashPassword(password: string) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

const saveUserOnSecureStorage = async (user: IUser) => {
    const hashedUser = {
        email: user.email,
        password: hashPassword(user.password),
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
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const queryClient = useQueryClient();

    useEffect(() => {
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

    const loginUser = async (user: IUser) => {
        saveUserOnSecureStorage(user);
        setUser(user);
    };

    function isLoggedIn() {
        return user !== null;
    }

    function logoutUser() {
        setUser(null);
        queryClient.clear();
        deleteUserDataFromSecureStorage();
        JWTTokenService.delete();
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
