import AsyncStorage from '@react-native-async-storage/async-storage'
import mongoose from 'mongoose'
import * as SecureStore from 'expo-secure-store'
import { ID } from '../models/types'
//

/* since storage only stores key-value pairs, when saving we can assume that it's squashing old values
also, values can only be strings, so, it has to be parsed when reading, and stringified when writing
this means that to make it efficient we should store entities in a list, and save that as the value, and the name of the collection as the key

so:
to create an object
    -retrieve the list
    -add the object
    -save the list
to read an existing object
    -retrieve the list
    -find the object by it id
    -return it
to update an existing object
    -retrieve the list
    -filter the item we're updating
    -add the new object
    -save the entire list
to delete an object
    -retrieve the list
    -filter the object we're deleting
    -save the entire list
then, getting the collections is trivial
*/
interface Identified {
	_id: ID
}

async function createCollection(collection: string): Promise<void> {
	//console.log(await AsyncStorage.getItem(collection) === null)
	if ((await AsyncStorage.getItem(collection)) === null) await AsyncStorage.setItem(collection, '[]')
}
async function createSecureCollection(collection: string): Promise<void> {
	//console.log(await AsyncStorage.getItem(collection) === null)
	if ((await SecureStore.getItemAsync(collection)) === null) await SecureStore.setItemAsync(collection, '[]')
}

const DB = {
	create: async <T>(collection: string, object: T) => {
		try {
			//console.log('creating...');
			await createCollection(collection)
			//console.log('checked for null collection');

			const list: T[] = JSON.parse((await AsyncStorage.getItem(collection)) as string)
			if (!(object as Identified)._id) (object as Identified)._id = new mongoose.Types.ObjectId() //this should give it a mongoose ObjectId if it doesn't have one

			if (!list.find((item) => (item as Identified)._id === (object as Identified)._id)) list.push(object)
			await AsyncStorage.setItem(collection, JSON.stringify(list))
			//console.log('List after creating: ',JSON.parse(await AsyncStorage.getItem(collection) as string));
		} catch (e) {
			console.log(e)
		}
	},
	read: async <T>(collection: string, id: string) => {
		try {
			//console.log('reading...');

			await createCollection(collection)
			const list: T[] = JSON.parse((await AsyncStorage.getItem(collection)) as string)
			//console.log(list);
			const foundItem = list.find((item) => (item as Identified)._id === id)
			//console.log('found item: ', foundItem);
			return foundItem
		} catch (e) {
			console.log(e)
			return null
		}
	},
	update: async <T>(collection: string, object: T) => {
		try {
			//console.log('updating...');

			await createCollection(collection)
			let list: T[] = JSON.parse((await AsyncStorage.getItem(collection)) as string)
			//console.log('list before update: ', list)
			list = list.filter((item) => (item as Identified)._id !== (object as Identified)._id)
			//console.log('list without the element we`re updating: ', list);

			list.push(object)
			//console.log('list after update: ', list);

			await AsyncStorage.setItem(collection, JSON.stringify(list))
		} catch (error) {
			console.log(error)
		}
	},
	delete: async <T>(collection: string, id: string) => {
		try {
			await createCollection(collection)
			let list: T[] = JSON.parse((await AsyncStorage.getItem(collection)) as string)
			list = list.filter((item) => (item as Identified)._id !== id)
			await AsyncStorage.setItem(collection, JSON.stringify(list))
		} catch (e) {
			console.log(e)
		}
	},
	getCollection: async <T>(collection: string) => {
		try {
			await createCollection(collection)
			const list: T[] = JSON.parse((await AsyncStorage.getItem(collection)) as string)
			return list
		} catch (e) {
			console.log(e)
			return []
		}
	},
	secureCreate: async <T>(collection: string, object: T) => {
		console.log(object)
		try {
			//console.log('creating...');
			await createSecureCollection(collection)
			//console.log('checked for null collection');

			const list: T[] = JSON.parse((await SecureStore.getItemAsync(collection)) as string)
			if (!(object as Identified)._id) (object as Identified)._id = new mongoose.Types.ObjectId() //this should give it a mongoose ObjectId if it doesn't have one

			if (!list.find((item) => (item as Identified)._id === (object as Identified)._id)) list.push(object)
			const stringList = JSON.stringify(list)
			console.log(stringList)
			await SecureStore.setItemAsync(collection, stringList)
			//console.log('List after creating: ',JSON.parse(await SecureStore.getItemAsync(collection) as string));
		} catch (e) {
			console.log(e)
		}
	},
	secureRead: async <T>(collection: string, id: string) => {
		try {
			//console.log('reading...');

			await createSecureCollection(collection)
			const list: T[] = JSON.parse((await SecureStore.getItemAsync(collection)) as string)
			//console.log(list);
			const foundItem = list.find((item) => (item as Identified)._id === id)
			//console.log('found item: ', foundItem);

			return foundItem
		} catch (e) {
			console.log(e)
		}
	},
	secureUpdate: async <T>(collection: string, object: T) => {
		try {
			//console.log('updating...');

			await createSecureCollection(collection)
			let list: T[] = JSON.parse((await SecureStore.getItemAsync(collection)) as string)
			//console.log('list before update: ', list)
			list = list.filter((item) => (item as Identified)._id !== (object as Identified)._id)
			//console.log('list without the element we`re updating: ', list);

			list.push(object)
			//console.log('list after update: ', list);

			await SecureStore.setItemAsync(collection, JSON.stringify(list))
		} catch (error) {
			console.log(error)
		}
	},
	secureDelete: async <T>(collection: string, id: string) => {
		try {
			await createSecureCollection(collection)
			let list: T[] = JSON.parse((await SecureStore.getItemAsync(collection)) as string)
			list = list.filter((item) => (item as Identified)._id === id)
			await SecureStore.setItemAsync(collection, JSON.stringify(list))
		} catch (e) {
			console.log(e)
		}
	},
	secureGetCollection: async <T>(collection: string) => {
		try {
			await createSecureCollection(collection)
			const list: T[] = JSON.parse((await SecureStore.getItemAsync(collection)) as string)
			return list
		} catch (e) {
			console.log(e)
			return []
		}
	}
}

export default DB
