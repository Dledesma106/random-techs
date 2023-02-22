import {useState} from 'react'
import UserContext from './UserContext'
import * as apiEndpoints from '../../lib/apiEndpoints'
import { ResponseData } from './types'
import { IUser } from '../../models/interfaces'
import { useMemo } from 'react'
import { useDB } from '../../hooks/useDB'
import Token from '../../lib/token'
import appInit from '../../lib/AppInit'
import bcryptjs from 'bcryptjs'
import { userWithoutPassword } from '../../lib/utils'

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
    const {getUserByEmail} = useDB()
    const [user, setUser] = useState<IUser>(INITIAL_STATE)

    //it logs in the user by sending a request to an endpoint that reads the access token cookie and returns the user corresponding to that access token
    async function loginUser(data:ILoginJson){    
        await Token.save('access_token', data.access_token)
        await appInit() // should synchronize data with remote db
        setUser(data.user)

    }

    function isLoggedIn(){
        return user.email!=''
    }

    function logoutUser(){
        setUser(INITIAL_STATE)
    }

    async function loginOffline(email:string, password:string){
        //console.log('searching user')
        const user = await getUserByEmail(email)
        if(!user) throw new Error('wrong email or password')
        console.log('user found by email in local db')
        console.log('comparing passwords')
        var startTime = performance.now()
        if(!bcryptjs.compareSync(password, user.password as string)) throw new Error('wrong email or password')
        var endTime = performance.now()
        console.log(`compareSync took ${endTime - startTime} milliseconds`) 

        console.log('correct password, logging in')
        //await appInit()
        setUser(userWithoutPassword(user))
    }

    const memoValue = useMemo(() => {
        return {user, loginUser, logoutUser, isLoggedIn, loginOffline}
    }, [user])

    return(
        <UserContext.Provider value={memoValue}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider