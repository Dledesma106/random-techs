import { IBranch } from "./interfaces";
import DB from "../lib/DB";

const collection='Branch'
const unsynched='Unsynched'+collection

const Branch = {
    get: async(id:string) =>{
        return DB.readItem<IBranch>(collection, id)
    },
    set: async(branch:IBranch)=>{
        return DB.updateItem<IBranch>(collection, branch)
    },
    new: async(branch:IBranch)=>{
        return DB.createItem<IBranch>(collection, branch)
    },
    delete: async(id:string) =>{
        return DB.deleteItem<IBranch>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IBranch>(collection)
    },
    setUnsynched: async(branch:IBranch)=>{
        return DB.updateItem<IBranch>(unsynched, branch)
    },
    newUnsynched: async(branch:IBranch)=>{
        return DB.createItem<IBranch>(unsynched, branch)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.deleteItem<IBranch>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IBranch>(unsynched)
    }

}

export default Branch