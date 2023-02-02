// it executes when the user logs in
//it handles synchonization with server, so it takes care of
// *Retrieving technician's assigned tasks and activities
// *Checking db for unsynched entities
// *sending those entities to the server and updating local entities

import fetcher from "./fetcher"
import * as api from './apiEndpoints'
import { IActivity, IExpense, ITask } from "../models/interfaces"
import Task from "../models/Task"
import Activity from "../models/Activity"
import Expense from "../models/Expense"
import Branch from "../models/Branch"
import Client from "../models/Client"

export default async function appInit(){
    await updateTechData()
    await syncUnsynchedData()
}

/* ------------ level 1 --------------- */
//retrieves all of the technician's tasks and activities and saves them to the db 
async function updateTechData(){
    const tasks = (await fetcher(api.tech.tasks, {}, 'GET')).tasks
    const activities = (await fetcher(api.tech.activities, {}, 'GET')).activities
    tasks.forEach(async(task:ITask) => {
        await Task.set(task)
        await Branch.set(task.branch)
        await Client.set(task.branch.client)
    });
    activities.forEach(async(activity:IActivity)=>{
        await Activity.set(activity)
    })
}
// checks the db for unsynched data, and either updates it or sends it to the server
async function syncUnsynchedData(){
    const unsynchedTasks = await Task.getAllUnsynched()
    const unsynchedActivities = await Activity.getAllUnsynched()
    const unsynchedExpenses = await Expense.getAllUnsynched()
    if(unsynchedTasks){
        unsynchedTasks.forEach(async(task:ITask) => {
            try {
                await fetcher(api.tech.tasks, task, 'POST')  
                Task.markAsSynched(task)      
            } catch (error) {
                console.log(error)
            }
        })
    }
    if(unsynchedActivities){
        unsynchedActivities.forEach(async(activity:IActivity) => {
            try {
                await fetcher(api.tech.activities, activity, 'POST')
                Activity.markAsSynched(activity)        
            } catch (error) {
                console.log(error);
            }
        })
    }
    if(unsynchedExpenses){
        unsynchedExpenses.forEach(async(expense:IExpense) => {
            try {
                await fetcher(api.tech.expenses, expense, 'POST')
                Expense.markAsSynched(expense)
            } catch (error) {
                console.log(error);
            }
        })
    }
}