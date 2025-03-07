import { createContext } from 'react';

import { LoginMutation } from '@/api/graphql';
import { ProfileScreenRouteProp } from '@/navigation/types';

interface UserContextProps {
    user: LoginMutation['login']['user'] | null;
    logoutUser: (navigation: ProfileScreenRouteProp['navigation']) => void;
    isLoggedIn: () => boolean;
    setUser: (
        user: NonNullable<LoginMutation['login']['user']>,
        password: string,
    ) => void;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default UserContext;
