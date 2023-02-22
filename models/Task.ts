import { IActivity, IBranch, ITask } from "./interfaces";
import DB from "../lib/DB";
import Branch from "./Branch";
import Activity from "./Activity";
const collection='Task'
const unsynched = 'Unsynched'+collection

const Task = {
    get: async(id:string) =>{
        return await DB.read<ITask>(collection, id)
    },
    set: async(task:ITask)=>{
        Branch.set(task.branch as IBranch)
        task.branch = (task.branch as IBranch)._id
        if(task.activity) {
            Activity.set(task.activity as IActivity)
            task.activity = (task.activity as IActivity)._id
        }
        //search for the incoming task
        //console.log(task)
        const currentTask = await DB.read<ITask>(collection, task._id as string)
        //console.log(!currentTask);
        
        //if no task is found, we create it
        if(!currentTask) return await DB.create(collection, task)
        //otherwise we update it
        await DB.update<ITask>(collection, task)
    },
    delete: async(id:string) =>{
        await DB.delete<ITask>(collection, id)
    },
    getAll: async() => {
        return await DB.getCollection<ITask>(collection)
    },
    setUnsynched: async(task:ITask)=>{
        if(!await DB.read(unsynched, task._id as string)) return await DB.create(unsynched, task)
        return await DB.update<ITask>(unsynched, task)
    },
    deleteUnsynched: async(id:string) =>{
        return await DB.delete<ITask>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return await DB.getCollection<ITask>(unsynched)
    },
    markAsSynched: async(task:ITask) => {
        await DB.delete(unsynched, task._id as string)
        await DB.create(collection, task)
    },
    markAsUnsynched: async(task:ITask) => {
        await DB.delete(collection, task._id as string)
        await DB.create(unsynched, task)
    },

}

export default Task