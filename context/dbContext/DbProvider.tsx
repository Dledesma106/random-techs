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
import Client from '../../models/Client'
import Branch from '../../models/Branch'
import User from '../../models/User'
import { TaskStatus } from '../../models/types'


export interface ILoginJson{
    user:IUser,
    access_token:string
}

export interface ProviderProps{
    children:JSX.Element | JSX.Element[]
}

const DbProvider = ({children}:ProviderProps) => {

    async function getTasks(){
        //console.log('getting the tasks from db')
        const synchedTasks = await Task.getAll()
        const unsynchedTasks = await Task.getAllUnsynched()
        return synchedTasks.concat(unsynchedTasks)
    }

    async function getTaskExpenses(taskId:string){
        const synchedExpenses = await Expense.getAll()
        const unsynchedExpenses = await Expense.getAllUnsynched()
        const expenses = synchedExpenses.concat(unsynchedExpenses)
        return expenses.filter(expense => {
            return expense.task? expense.task === taskId : false
        })
    }

    async function getUserByEmail(email:string){
        //console.log('getting synced users')
        const synchedUsers = await User.getAll()
        //console.log('getting unsynced users')

        const unsynchedUsers = await User.getAllUnsynched()

        //console.log('concatenating users')

        const users = synchedUsers.concat(unsynchedUsers)
        //console.log('finding user')

        return users.find(user => user.email === email)
    }

    async function saveLocalUser(user:IUser, password:string){
        await User.set(user, password)
    }

    async function getTasksByStatus(status:TaskStatus){
        //console.log('getting the tasks from db')
        const synchedTasks = await Task.getAll()
        const unsynchedTasks = await Task.getAllUnsynched()
        const tasks = synchedTasks.concat(unsynchedTasks)
        return tasks.filter((task:ITask )=> task.status === status)
    }

    async function getActivities(){
        const synchedActivties = await Activity.getAll()
        const unsynchedActivties = await Activity.getAllUnsynched()
        return synchedActivties.concat(unsynchedActivties)
    }

    async function getExpenses(){
        const synchedExpenses = await Expense.getAll()
        const unsynchedExpenses = await Expense.getAllUnsynched()
        return synchedExpenses.concat(unsynchedExpenses)
    }

    async function refreshTasks(){
        const tasksData = await fetcher(apiEndpoints.tech.tasks, {}, 'GET')
        const tasks = tasksData.tasks
        tasks.forEach(async(task:ITask) => {
            await Task.set(task)
            await Branch.set(task.branch)
            await Client.set(task.branch.client)
        });
    }

    async function getClients(){
        return await Client.getAll() || []
    }

    async function getBranches(){
        return await Branch.getAll() || []
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
    


    return(
        <DbContext.Provider value={{getTasks, getTasksByStatus, getActivities, getExpenses, getTaskExpenses, getClients, getBranches, getUserByEmail, refreshTasks, saveLocalUser, saveTask, saveActivity, saveExpense}}>
            {children}
        </DbContext.Provider>
    )
}

export default DbProvider