import { type IActivity } from './interfaces'
import DB from '../lib/DB'

const collection = 'Activity'
const unsynched = 'Unsynched' + collection

const Activity = {
	get: async (id: string) => {
		return await DB.read<IActivity>(collection, id)
	},
	set: async (activity: IActivity) => {
		if (activity.deleted) return await Activity.delete(activity._id as string)
		if ((await DB.read<IActivity>(collection, activity._id as string)) === null) return await DB.create(collection, activity)
		await DB.update<IActivity>(collection, activity)
	},
	delete: async (id: string) => {
		await DB.delete<IActivity>(collection, id)
	},
	getAll: async () => {
		return await DB.getCollection<IActivity>(collection)
	},
	getUnsynched: async (id: string) => {
		return await DB.read<IActivity>(unsynched, id)
	},
	setUnsynched: async (activity: IActivity) => {
		if ((await DB.read<IActivity>(unsynched, activity._id as string)) === null) return await DB.create(unsynched, activity)
		await DB.update<IActivity>(unsynched, activity)
	},
	deleteUnsynched: async (id: string) => {
		await DB.delete<IActivity>(unsynched, id)
	},
	getAllUnsynched: async () => {
		return await DB.getCollection<IActivity>(unsynched)
	},
	markAsSynched: async (activity: IActivity) => {
		await DB.delete(unsynched, activity._id as string)
		await DB.create(collection, activity)
	},
	markAsUnsynched: async (activity: IActivity) => {
		await DB.delete(collection, activity._id as string)
		await DB.create(unsynched, activity)
	}
}

export default Activity
