import { IActivity, IExpense, ITask } from './interfaces'
import DB from '../lib/DB'
import Activity from './Activity'
import Task from './Task'

const collection = 'Expense'
const unsynched = 'Unsynched' + collection

const Expense = {
	get: async (id: string) => {
		const expense = await DB.read<IExpense>(collection, id)
		if (!expense) return undefined
		if (expense.activity) expense.activity = await Activity.get(expense.activity as string) ?? undefined
		if (expense.task) expense.task = await Task.get(expense.task as string)
		return expense
	},
	set: async (expense: IExpense) => {
		if (expense.activity) {
			await Activity.set(expense.activity as IActivity)
			expense.activity = (expense.activity as IActivity)._id
		}
		if (expense.task) {
			await Task.set(expense.task as ITask)
			expense.task = (expense.task as ITask)._id
		}
		const existingExpense = await DB.read(collection, expense._id as string)
		if (!existingExpense) return await DB.create(collection, expense)
		await DB.update<IExpense>(collection, expense)
	},
	delete: async (id: string) => {
		await DB.delete<IExpense>(collection, id)
	},
	getAll: async () => {
		return await DB.getCollection<IExpense>(collection)
	},
	setUnsynched: async (expense: IExpense) => {
		if (!(await DB.read(unsynched, expense._id as string))) return await DB.create(unsynched, expense)
		await DB.update<IExpense>(unsynched, expense)
	},
	deleteUnsynched: async (id: string) => {
		await DB.delete<IExpense>(unsynched, id)
	},
	getAllUnsynched: async () => {
		return await DB.getCollection<IExpense>(unsynched)
	},
	markAsSynched: async (expense: IExpense) => {
		await DB.delete(unsynched, expense._id as string)
		await DB.create(collection, expense)
	},
	markAsUnsynched: async (expense: IExpense) => {
		await DB.delete(collection, expense._id as string)
		await DB.create(unsynched, expense)
	}
}

export default Expense
