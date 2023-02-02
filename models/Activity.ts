import { IActivity } from "./interfaces";
import DB from "../lib/DB";

const collection='Activity'
const unsynched='Unsynched'+collection
const Activity = {
    get: async(id:string) =>{
        return DB.read<IActivity>(collection, id)
    },
    set: async(activity:IActivity)=>{
        if(!DB.read(collection, activity._id as string)) DB.create(collection, activity)
        DB.update<IActivity>(collection, activity)
    },
    delete: async(id:string) =>{
        DB.delete<IActivity>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IActivity>(collection)
    },
    getUnsynched: async(id:string) =>{
        return DB.read<IActivity>(unsynched, id)
    },
    setUnsynched: async(activity:IActivity)=>{
        if(!DB.read(unsynched, activity._id as string)) DB.create(unsynched, activity)
        DB.update<IActivity>(unsynched, activity)
    },
    deleteUnsynched: async(id:string) =>{
        DB.delete<IActivity>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IActivity>(unsynched)
    },
    markAsSynched: async(activity:IActivity) => {
        DB.delete(unsynched, activity._id as string)
        DB.create(collection, activity)
    },
    markAsUnsynched: async(activity:IActivity) => {
        DB.delete(collection, activity._id as string)
        DB.create(unsynched, activity)
    },

}

export default Activity