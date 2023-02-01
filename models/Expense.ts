import { IExpense } from "./interfaces";
import DB from "../lib/DB";

const collection='Expense'
const unsynched='Unsynched'+collection

const Expense = {
    get: async(id:string) =>{
        return DB.readItem<IExpense>(collection, id)
    },
    set: async(expense:IExpense)=>{
        return DB.updateItem<IExpense>(collection, expense)
    },
    new: async(expense:IExpense)=>{
        return DB.createItem<IExpense>(collection, expense)
    },
    delete: async(id:string) =>{
        return DB.deleteItem<IExpense>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IExpense>(collection)
    },
    setUnsynched: async(expense:IExpense)=>{
        return DB.updateItem<IExpense>(unsynched, expense)
    },
    newUnsynched: async(expense:IExpense)=>{
        return DB.createItem<IExpense>(unsynched, expense)
    },
    deleteUnsynched: async(id:string) =>{
        return DB.deleteItem<IExpense>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IExpense>(unsynched)
    }

}

export default Expense