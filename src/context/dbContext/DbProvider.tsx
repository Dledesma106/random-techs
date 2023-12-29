import DbContext from './DbContext';

//import { ResponseData } from './types'
import Activity from '../../models/Activity';
import Branch from '../../models/Branch';
import Client from '../../models/Client';
import Expense from '../../models/Expense';
import { ITask, IUser } from '../../models/interfaces';
//import { useMemo } from 'react'
import Task from '../../models/Task';
import { TaskStatus } from '../../models/types';
import User from '../../models/User';

export interface ILoginJson {
    user: IUser;
    access_token: string;
}

export interface ProviderProps {
    children: JSX.Element | JSX.Element[];
}

const DbProvider = ({ children }: ProviderProps) => {
    async function getTasks() {
        const synchedTasks = await Task.getAll();
        const unsynchedTasks = await Task.getAllUnsynched();
        return synchedTasks.concat(unsynchedTasks);
    }

    async function getTaskExpenses(taskId: string) {
        const synchedExpenses = await Expense.getAll();
        const unsynchedExpenses = await Expense.getAllUnsynched();
        const expenses = synchedExpenses.concat(unsynchedExpenses);
        return expenses.filter((expense) => {
            return expense.task ? expense.task === taskId : false;
        });
    }

    async function getUserByEmail(email: string) {
        const synchedUsers = await User.getAll();
        const unsynchedUsers = await User.getAllUnsynched();
        const users = synchedUsers.concat(unsynchedUsers);

        return users.find((user) => user.email === email);
    }

    async function saveLocalUser(user: IUser, password: string) {
        await User.set(user, password);
    }

    async function getTasksByStatus(status: TaskStatus) {
        const synchedTasks = await Task.getAll();
        const unsynchedTasks = await Task.getAllUnsynched();
        const tasks = synchedTasks.concat(unsynchedTasks);
        return tasks.filter((task: ITask) => task.status === status);
    }

    async function getActivities() {
        const synchedActivties = await Activity.getAll();
        const unsynchedActivties = await Activity.getAllUnsynched();
        return synchedActivties.concat(unsynchedActivties);
    }

    async function getExpenses() {
        const synchedExpenses = await Expense.getAll();
        const unsynchedExpenses = await Expense.getAllUnsynched();
        return synchedExpenses.concat(unsynchedExpenses);
    }

    async function getClients() {
        return (await Client.getAll()) || [];
    }

    async function getBranches() {
        return (await Branch.getAll()) || [];
    }

    return (
        <DbContext.Provider
            value={{
                getTasks,
                getTasksByStatus,
                getActivities,
                getExpenses,
                getTaskExpenses,
                getClients,
                getBranches,
                getUserByEmail,
                saveLocalUser,
            }}
        >
            {children}
        </DbContext.Provider>
    );
};

export default DbProvider;
