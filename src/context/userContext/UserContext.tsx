import { createContext } from 'react';

import { ProfileScreenRouteProp } from '@/navigation/types';

import { IUser } from '../../models/interfaces';

interface UserContextProps {
    user: IUser | null;
    logoutUser: (navigation: ProfileScreenRouteProp['navigation']) => void;
    isLoggedIn: () => boolean;
    setUser: (user: IUser) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default UserContext;
