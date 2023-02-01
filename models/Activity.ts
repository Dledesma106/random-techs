import { IActivity } from "./interfaces";
import DB from "../lib/DB";

const collection='Activity'
const unsynched='Unsynched'+collection
const Activity = {
    get: async(id:string) =>{
        return DB.readItem<IActivity>(collection, id)
    },
    set: async(activity:IActivity)=>{
        return DB.updateItem<IActivity>(collection, activity)
    },
    new: async(activity:IActivity)=>{
        return DB.createItem<IActivity>(collection, activity)
    },
    delete: async(id:string) =>{
        return DB.deleteItem<IActivity>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IActivity>(collection)
    },
    getUnsynched: async(id:string) =>{
        return DB.readItem<IActivity>(unsynched, id)
    },
    setUnsynched: async(activity:IActivity)=>{
        return DB.updateItem<IActivity>(unsynched, activity)
    },
    newUnsynched: async(activity:IActivity)=>{
        return DB.createItem<IActivity>(unsynched, activity)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.deleteItem<IActivity>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IActivity>(unsynched)
    }

}

export default Activity