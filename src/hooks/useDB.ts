import { useContext } from 'react';

import DbContext from '../context/dbContext/DbContext';

export const useDb = () => {
    const context = useContext(DbContext);
    return context;
};
