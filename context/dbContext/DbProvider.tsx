import {useState} from 'react'
import DbContext from './DbContext'
import * as apiEndpoints from '../../lib/apiEndpoints'
//import { ResponseData } from './types'
import { IActivity, IExpense, ITask, IUser } from '../../models/interfaces'
import { useMemo } from 'react'
import Task from '../../models/Task'
import Activity from '../../models/Activity'
import Expense from '../../models/Expense'
import fetcher from '../../lib/fetcher'


export interface ILoginJson{
    user:IUser,
    access_token:string
}

export interface ProviderProps{
    children:JSX.Element | JSX.Element[]
}

const DbProvider = ({children}:ProviderProps) => {

    async function getTasks(){
        const synchedTasks = await Task.getAll()
        const unsynchedTasks = await Task.getAllUnsynched()
        if(synchedTasks && unsynchedTasks) return synchedTasks.concat(unsynchedTasks)
        if(!synchedTasks && unsynchedTasks) return unsynchedTasks
        if(!unsynchedTasks && synchedTasks) return synchedTasks
        return []
    }

    async function getActivities(){
        const synchedActivties = await Activity.getAll()
        const unsynchedActivties = await Activity.getAllUnsynched()
        if(synchedActivties && unsynchedActivties) return synchedActivties.concat(unsynchedActivties)
        if(!synchedActivties && unsynchedActivties) return unsynchedActivties
        if(!unsynchedActivties && synchedActivties) return synchedActivties
        return []
    }

    async function getExpenses(){
        const synchedExpenses = await Expense.getAll()
        const unsynchedExpenses = await Expense.getAllUnsynched()
        if(synchedExpenses && unsynchedExpenses) return synchedExpenses.concat(unsynchedExpenses)
        if(!synchedExpenses && unsynchedExpenses) return unsynchedExpenses
        if(!unsynchedExpenses && synchedExpenses) return synchedExpenses
        return []
    }

    async function saveTask(task:ITask){
        try {
            await fetcher(apiEndpoints.tech.tasks, task, 'POST')
            Task.set(task)
        } catch (error) {
            console.log(error);
            Task.setUnsynched(task)
        }
    }

    async function saveActivity(activity:IActivity){
        try {
            await fetcher(apiEndpoints.tech.activities, activity, 'POST')
            Activity.set(activity)
        } catch (error) {
            console.log(error);
            Activity.setUnsynched(activity)
        }
    }

    async function saveExpense(expense:IExpense){
        try {
            await fetcher(apiEndpoints.tech.expenses, Expense, 'POST')
            Expense.set(expense)
        } catch (error) {
            console.log(error);
            Expense.setUnsynched(expense)
        }
    }
    

    const memoValue = useMemo(() => {
        return {getTasks, getActivities, getExpenses, saveTask, saveActivity, saveExpense}
    }, [])

    return(
        <DbContext.Provider value={memoValue}>
            {children}
        </DbContext.Provider>
    )
}

export default DbProvider