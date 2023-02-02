import { IExpense } from "./interfaces";
import DB from "../lib/DB";

const collection='Expense'
const unsynched='Unsynched'+collection

const Expense = {
    get: async(id:string) =>{
        return await DB.read<IExpense>(collection, id)
    },
    set: async(expense:IExpense)=>{
        if(!await DB.read(collection, expense._id as string))return await DB.create(collection, expense)
        await DB.update<IExpense>(collection, expense)
    },
    delete: async(id:string) =>{
        await DB.delete<IExpense>(collection, id)
    },
    getAll: async() => {
        return await DB.getCollection<IExpense>(collection)
    },
    setUnsynched: async(expense:IExpense)=>{
        if(!await DB.read(unsynched, expense._id as string))return await DB.create(unsynched, expense)
        await DB.update<IExpense>(unsynched, expense)
    },
    deleteUnsynched: async(id:string) =>{
        await DB.delete<IExpense>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return await DB.getCollection<IExpense>(unsynched)
    },
    markAsSynched: async(expense:IExpense) => {
        await DB.delete(unsynched, expense._id as string)
        await DB.create(collection, expense)
    },
    markAsUnsynched: async(expense:IExpense) => {
        await DB.delete(collection, expense._id as string)
        await DB.create(unsynched, expense)
    },

}

export default Expense