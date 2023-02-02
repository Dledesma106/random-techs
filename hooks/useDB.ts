import  DbContext from '../context/dbContext/DbContext'
import {useContext} from 'react'

export const useDB = () => {
    const context = useContext(DbContext)
    return context
}