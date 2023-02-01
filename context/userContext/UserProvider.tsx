import {useState} from 'react'
import UserContext from './UserContext'
import * as apiEndpoints from '../../lib/apiEndpoints'
import { ResponseData } from './types'
import { IUser } from '../../models/interfaces'
import { useMemo } from 'react'

import Token from '../../lib/token'

const INITIAL_STATE = {
    email:'',
    firstName:'',
    lastName:'',
    fullname:'',
    _id:'',
    roles:[]
}

export interface ILoginJson{
    user:IUser,
    access_token:string
}

export interface ProviderProps{
    children:JSX.Element | JSX.Element[]
}

const UserProvider = ({children}:ProviderProps) => {

    const [user, setUser] = useState<IUser>(INITIAL_STATE)

    //it logs in the user by sending a request to an endpoint that reads the access token cookie and returns the user corresponding to that access token
    async function loginUser(data:ILoginJson){      
        Token.save('access_token', data.access_token)
        setUser(data.user)
    }

    function isLoggedIn(){
        return user.email!=''
    }

    function logoutUser(){
        setUser(INITIAL_STATE)
    }

    const memoValue = useMemo(() => {
        return {user, loginUser, logoutUser, isLoggedIn}
    }, [user])

    return(
        <UserContext.Provider value={memoValue}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider