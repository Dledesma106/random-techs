import { ITask } from "./interfaces";
import DB from "../lib/DB";

const collection='Task'
const unsynched = 'Unsynched'+collection
const Task = {
    get: async(id:string) =>{
        return DB.read<ITask>(collection, id)
    },
    set: async(task:ITask)=>{
        if(!DB.read(collection, task._id as string)) DB.create(collection, task)
        DB.update<ITask>(collection, task)
    },
    delete: async(id:string) =>{
        return DB.delete<ITask>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<ITask>(collection)
    },
    setUnsynched: async(task:ITask)=>{
        if(!DB.read(unsynched, task._id as string)) DB.create(unsynched, task)
        return DB.update<ITask>(unsynched, task)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.delete<ITask>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<ITask>(unsynched)
    },
    markAsSynched: async(task:ITask) => {
        DB.delete(unsynched, task._id as string)
        DB.create(collection, task)
    },
    markAsUnsynched: async(task:ITask) => {
        DB.delete(collection, task._id as string)
        DB.create(unsynched, task)
    },

}

export default Task