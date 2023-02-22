import { createContext} from 'react';
import { IUser } from '../../models/interfaces';
import { ILoginJson } from './UserProvider';


interface UserContextProps{
    user: IUser;
    loginUser: (data:ILoginJson) => Promise<void>;
    logoutUser: () => void;
    isLoggedIn: () => boolean;
    loginOffline: (email:string, password:string) => Promise<void>
}

const UserContext = createContext<UserContextProps>({} as UserContextProps)

export default UserContext
