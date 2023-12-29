import { useContext } from 'react';

import UserContext from './UserContext';

export const useUserContext = () => {
    const context = useContext(UserContext);
    return context;
};
