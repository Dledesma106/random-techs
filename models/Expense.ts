import { IExpense } from "./interfaces";
import DB from "../lib/DB";
import mongoose from "mongoose";

const collection='Expense'
const unsynched='Unsynched'+collection

const Expense = {
    get: async(id:string) =>{
        return DB.read<IExpense>(collection, id)
    },
    set: async(expense:IExpense)=>{
        if(!DB.read(collection, expense._id as string)) DB.create(collection, expense)
        DB.update<IExpense>(collection, expense)
    },
    delete: async(id:string) =>{
        DB.delete<IExpense>(collection, id)
    },
    getAll: async() => {
        return DB.getCollection<IExpense>(collection)
    },
    setUnsynched: async(expense:IExpense)=>{
        if(!DB.read(unsynched, expense._id as string)) DB.create(unsynched, expense)
        DB.update<IExpense>(unsynched, expense)
    },
    deleteUnsynched: async(id:string) =>{
        DB.delete<IExpense>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return DB.getCollection<IExpense>(unsynched)
    },
    markAsSynched: async(expense:IExpense) => {
        DB.delete(unsynched, expense._id as string)
        DB.create(collection, expense)
    },
    markAsUnsynched: async(expense:IExpense) => {
        DB.delete(collection, expense._id as string)
        DB.create(unsynched, expense)
    },

}

export default Expense