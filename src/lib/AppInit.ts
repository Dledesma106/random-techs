// it executes when the user logs in
//it handles synchonization with server, so it takes care of
// *Retrieving technician's assigned tasks and activities
// *Checking db for unsynched entities
// *sending those entities to the server and updating local entities

//import * as SecureStore from 'expo-secure-store'
import * as api from './apiEndpoints';
import fetcher from './fetcher';

import Activity from '../models/Activity';
import Expense from '../models/Expense';
import { ITask } from '../models/interfaces';
import Task from '../models/Task';

export default async function appInit(): Promise<void> {
    await updateTechData();
    await syncUnsynchedData();
}

export async function updateTasks(): Promise<void> {
    const data = await fetcher.get(api.tech.tasks);
    const tasks: ITask[] = data.tasks;

    for (const task of tasks) {
        await Task.set(task);
    }
}

//retrieves all of the technician's tasks and activities and saves them to the db
async function updateTechData(): Promise<void> {
    await updateTasks();
    //const activities = (await fetcher(api.tech.activities, {}, 'GET')).activities
    /*activities.forEach(async(activity:IActivity)=>{
        await Activity.set(activity)
    }) */
}
// checks the db for unsynched data and sends it to the server
async function syncUnsynchedData(): Promise<void> {
    const unsynchedTasks = await Task.getAllUnsynched();
    const unsynchedActivities = await Activity.getAllUnsynched();
    const unsynchedExpenses = await Expense.getAllUnsynched();
    if (unsynchedTasks) {
        for (const task of unsynchedTasks) {
            try {
                await fetcher.post(api.tech.tasks, task);
                await Task.markAsSynched(task);
            } catch (error) {
                console.error(error);
            }
        }
    }
    if (unsynchedActivities) {
        for (const activity of unsynchedActivities) {
            try {
                await fetcher.post(api.tech.activities, activity);
                await Activity.markAsSynched(activity);
            } catch (error) {
                console.error(error);
            }
        }
    }
    if (unsynchedExpenses) {
        for (const expense of unsynchedExpenses) {
            try {
                await fetcher.post(api.tech.expenses, expense);
                await Expense.markAsSynched(expense);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
