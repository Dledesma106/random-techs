import { createContext } from 'react';

import { IUser } from '../../models/interfaces';

interface UserContextProps {
    user: IUser | null;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
    setUser: (user: IUser) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default UserContext;
