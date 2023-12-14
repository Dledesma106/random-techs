import { createContext } from 'react';

import { ILoginJson } from './UserProvider';

import { IUser } from '../../models/interfaces';

interface UserContextProps {
    user: IUser;
    loginUser: (data: ILoginJson) => Promise<void>;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
    loginOffline: (email: string, password: string) => Promise<void>;
    setUser: (user: IUser) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default UserContext;
