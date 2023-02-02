import { IBranch } from "./interfaces";
import DB from "../lib/DB";

const collection='Branch'
const unsynched='Unsynched'+collection

const Branch = {
    get: async(id:string) =>{
        return DB.read<IBranch>(collection, id)
    },
    set: async(branch:IBranch)=>{
        if(!DB.read(collection, branch._id as string)) DB.create(collection, branch)
        DB.update<IBranch>(collection, branch)
    },
    delete: async(id:string) =>{
        DB.delete<IBranch>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IBranch>(collection)
    },
    setUnsynched: async(branch:IBranch)=>{
        if(!DB.read(unsynched, branch._id as string)) DB.create(unsynched, branch)
        return DB.update<IBranch>(unsynched, branch)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.delete<IBranch>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IBranch>(unsynched)
    },
    markAsSynched: async(branch:IBranch) => {
        DB.delete(unsynched, branch._id as string)
        DB.create(collection, branch)
    },
    markAsUnsynched: async(branch:IBranch) => {
        DB.delete(collection, branch._id as string)
        DB.create(unsynched, branch)
    },

}

export default Branch