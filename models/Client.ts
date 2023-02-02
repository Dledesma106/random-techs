import { IClient } from "./interfaces";
import DB from "../lib/DB";

const collection='Client'
const unsynched = 'Unsynched'+collection

const Client = {
    get: async(id:string) =>{
        return DB.read<IClient>(collection, id)
    },
    set: async(client:IClient)=>{
        if(!DB.read(collection, client._id as string)) DB.create(collection, client)
        DB.update<IClient>(collection, client)
    },
    delete: async(id:string) =>{
        return DB.delete<IClient>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IClient>(collection)
    },
    getUnsynched: async(id:string) =>{
        return DB.read<IClient>(unsynched, id)
    },
    setUnsynched: async(client:IClient)=>{
        if(!DB.read(unsynched, client._id as string)) DB.create(unsynched, client)
        DB.update<IClient>(unsynched, client)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.delete<IClient>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IClient>(unsynched)
    }
}

export default Client