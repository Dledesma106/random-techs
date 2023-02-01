import { ITask } from "./interfaces";
import DB from "../lib/DB";

const collection='Task'
const unsynched = 'Unsynched'+collection
const Task = {
    get: async(id:string) =>{
        return DB.readItem<ITask>(collection, id)
    },
    set: async(task:ITask)=>{
        return DB.updateItem<ITask>(collection, task)
    },
    new: async(task:ITask)=>{
        return DB.createItem<ITask>(collection, task)
    },
    delete: async(id:string) =>{
        return DB.deleteItem<ITask>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<ITask>(collection)
    },
    setUnsynched: async(task:ITask)=>{
        return DB.updateItem<ITask>(unsynched, task)
    },
    newUnsynched: async(task:ITask)=>{
        return DB.createItem<ITask>(unsynched, task)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.deleteItem<ITask>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<ITask>(unsynched)
    }

}

export default Task