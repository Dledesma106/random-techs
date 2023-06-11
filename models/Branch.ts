import { IBranch, ICity, IClient, IProvince } from "./interfaces";
import DB from "../lib/DB";
import Client from "./Client";

const collection='Branch'
const unsynched='Unsynched'+collection

const Branch = {
    get: async(id:string) =>{
        const branch = await DB.read<IBranch>(collection, id)
        if(!branch) return {} as IBranch
        branch.client = await Client.get(branch.client as string) as IClient
        return branch
    },
    set: async(branch:IBranch)=>{
        await Client.set(branch.client as IClient)
        if(branch.deleted) return await Branch.delete(branch._id as string)
        branch.client = (branch.client as IClient)._id
        branch.city = `${(branch.city as ICity).name}, ${((branch.city as ICity).province as IProvince).name}`
        if(!await DB.read(collection, branch._id as string))return await DB.create(collection, branch)
        await DB.update<IBranch>(collection, branch)
    },
    delete: async(id:string) =>{
        await DB.delete<IBranch>(collection, id)
    },
    getAll: async() => {
        return Promise.all((await DB.getCollection<IBranch>(collection)).map(async(branch:IBranch)=> await Branch.get(branch._id as string)))
    },
    setUnsynched: async(branch:IBranch)=>{
        if(!await DB.read(unsynched, branch._id as string))return await DB.create(unsynched, branch)
        return await DB.update<IBranch>(unsynched, branch)
    },
    deleteUnsynched: async(id:string) =>{
        return await DB.delete<IBranch>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return Promise.all((await DB.getCollection<IBranch>(unsynched)).map(async(branch:IBranch)=> await Branch.get(branch._id as string)))
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