// it executes when the user logs in
//it handles synchonization with server, so it takes care of
// *Retrieving technician's assigned tasks and activities
// *Checking db for unsynched entities
// *sending those entities to the server and updating local entities
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from 'expo-secure-store'
import fetcher from "./fetcher"
import * as api from './apiEndpoints'
import { IActivity, IExpense, ITask } from "../models/interfaces"
import Task from "../models/Task"
import Activity from "../models/Activity"
import Expense from "../models/Expense"
import Branch from "../models/Branch"
import Client from "../models/Client"


export default async function appInit(){
    //console.log('appInit');
    //console.log('clearing...');
    //await AsyncStorage.clear()
    //await SecureStore.deleteItemAsync('User')
    /* console.log(await AsyncStorage.getItem('Task'));
    console.log(await AsyncStorage.getItem('Branch'));
    console.log(await AsyncStorage.getItem('Client')); */
    
    await updateTechData()
    await syncUnsynchedData()
}


//retrieves all of the technician's tasks and activities and saves them to the db 
async function updateTechData(){
    const tasksData = await fetcher(api.tech.tasks, {}, 'GET')
    const tasks:ITask[] = tasksData.tasks
    //console.log(tasks)
    for(const task of tasks){//we use a for .. of loop instead of a forEach because we need to await every set of a task before we set the next one, since forEach fires an asynchronous function for every item in the array
        await Task.set(task)
        await Branch.set(task.branch)
        await Client.set(task.branch.client)
    }
    //const activities = (await fetcher(api.tech.activities, {}, 'GET')).activities
    /*activities.forEach(async(activity:IActivity)=>{
        await Activity.set(activity)
    }) */
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