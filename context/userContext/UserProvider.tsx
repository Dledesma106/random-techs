import {useState} from 'react'
import UserContext from './UserContext'
import * as apiEndpoints from '../../lib/apiEndpoints'
import { ResponseData } from './types'
import { IUser } from './interfaces'
import { useMemo } from 'react'

const INITIAL_STATE = {
    email:'',
    firstName:'',
    lastName:'',
    fullname:'',
    _id:'',
    roles:[]
}

export interface ProviderProps{
    children:JSX.Element | JSX.Element[]
}

const UserProvider = ({children}:ProviderProps) => {

    const [user, setUser] = useState<IUser>(INITIAL_STATE)
    
    async function getUser():Promise<IUser>{
        const res = await fetch(apiEndpoints.loggedInUser)
        if(!res.ok){
            console.log('fetch failed');
            
            return INITIAL_STATE    
        }
        const json:ResponseData = await res.json()
        if(!json.data.user){
            console.log('no user found');
            
            return INITIAL_STATE   
        }
        return json.data.user    
    }

    //it logs in the user by sending a request to an endpoint that reads the access token cookie and returns the user corresponding to that access token
    async function loginUser(){
        setUser(await getUser())
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