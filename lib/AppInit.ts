// it executes when the user logs in
//it handles synchonization with server, so it takes care of
// *Retrieving technician's assigned tasks and activities
// *Checking db for unsynched entities
// *sending those entities to the server and updating local entities
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from 'expo-secure-store'
import fetcher from "./fetcher"
import * as api from './apiEndpoints'
import { IActivity, IBranch, IClient, IExpense, ITask } from "../models/interfaces"
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

export async function updateTasks(){
    const data = await fetcher.get(api.tech.tasks)
    const tasks:ITask[] = data.tasks
    //console.log(tasks)
    for(const task of tasks){//we use a for .. of loop instead of a forEach because we need to await the setting of a task before we set the next one, since forEach fires an asynchronous function for every item in the array
        await Task.set(task)
    }
}

//retrieves all of the technician's tasks and activities and saves them to the db 
async function updateTechData(){
    updateTasks()
    //const activities = (await fetcher(api.tech.activities, {}, 'GET')).activities
    /*activities.forEach(async(activity:IActivity)=>{
        await Activity.set(activity)
    }) */
}
// checks the db for unsynched data and sends it to the server
async function syncUnsynchedData(){
    const unsynchedTasks = await Task.getAllUnsynched()
    const unsynchedActivities = await Activity.getAllUnsynched()
    const unsynchedExpenses = await Expense.getAllUnsynched()
    if(unsynchedTasks){
        for(const task of unsynchedTasks) {
            try {
                await fetcher.post(api.tech.tasks, task)  
                await Task.markAsSynched(task as ITask)      
            } catch (error) {
                console.log(error)
            }
        }
    }
    if(unsynchedActivities){
        for (const activity of unsynchedActivities){
            try {
                await fetcher.post(api.tech.activities, activity)
                await Activity.markAsSynched(activity)        
            } catch (error) {
                console.log(error);
            }
        }
    }
    if(unsynchedExpenses){
        for(const expense of unsynchedExpenses){
            try {
                await fetcher.post(api.tech.expenses, expense)
                await Expense.markAsSynched(expense)
            } catch (error) {
                console.log(error);
            }
        }
    }
}