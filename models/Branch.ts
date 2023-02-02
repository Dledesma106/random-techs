import { IBranch } from "./interfaces";
import DB from "../lib/DB";

const collection='Branch'
const unsynched='Unsynched'+collection

const Branch = {
    get: async(id:string) =>{
        return await DB.read<IBranch>(collection, id)
    },
    set: async(branch:IBranch)=>{
        if(!await DB.read(collection, branch._id as string))return await DB.create(collection, branch)
        await DB.update<IBranch>(collection, branch)
    },
    delete: async(id:string) =>{
        await DB.delete<IBranch>(collection, id)
    },
    getAll: async() => {
        return await DB.getCollection<IBranch>(collection)
    },
    setUnsynched: async(branch:IBranch)=>{
        if(!await DB.read(unsynched, branch._id as string))return await DB.create(unsynched, branch)
        return await DB.update<IBranch>(unsynched, branch)
    },
    deleteUnsynched: async(id:string) =>{
        return await DB.delete<IBranch>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return await DB.getCollection<IBranch>(unsynched)
    },
    markAsSynched: async(branch:IBranch) => {
        await DB.delete(unsynched, branch._id as string)
        await DB.create(collection, branch)
    },
    markAsUnsynched: async(branch:IBranch) => {
        await DB.delete(collection, branch._id as string)
        await DB.create(unsynched, branch)
    },

}

export default Branch