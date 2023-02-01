import { IClient } from "./interfaces";
import DB from "../lib/DB";

const collection='Client'
const unsynched = 'Unsynched'+collection

const Client = {
    get: async(id:string) =>{
        return DB.readItem<IClient>(collection, id)
    },
    set: async(client:IClient)=>{
        return DB.updateItem<IClient>(collection, client)
    },
    new: async(client:IClient)=>{
        return DB.createItem<IClient>(collection, client)
    },
    delete: async(id:string) =>{
        return DB.deleteItem<IClient>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IClient>(collection)
    },
    getUnsynched: async(id:string) =>{
        return DB.readItem<IClient>(unsynched, id)
    },
    setUnsynched: async(client:IClient)=>{
        return DB.updateItem<IClient>(unsynched, client)
    },
    newUnsynched: async(client:IClient)=>{
        return DB.createItem<IClient>(unsynched, client)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.deleteItem<IClient>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IClient>(unsynched)
    }
}

export default Client