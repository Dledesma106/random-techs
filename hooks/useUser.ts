import  UserContext from '../context/userContext/UserContext'
import {useContext} from 'react'

export const useUser = () => {
    const context = useContext(UserContext)
    return context
}