import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemoteId, LocalId } from '../models/types';
//

/* since storage only storages key-value pairs, when saving we can assume that it's squashing old values
also, values can only be strings, so, it has to be parsed when reading, and stringified when writing
this means that to make it efficient we should store entities in a list, and save that as the value, and the name of the colection as the key

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
    _id:RemoteId,
    id:LocalId
}

const DB = {
    createItem: async <T>(collection:string, object:T) => {
        try {
            let list: T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            list.push(object)
            await AsyncStorage.setItem(collection, JSON.stringify(list))
        } catch (e) {
          console.log(e);
        }
    },
    readItem: async <T>(collection:string, id:string) =>{
        try{
            let list:T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            return list.find(item => (item as Identified)._id === id)
        }catch(e){
            console.log(e);
        }
    },
    readLocalItem: async <T>(collection:string, id:string) =>{
        try{
            let list:T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            return list.find(item => (item as Identified).id === id)
        }catch(e){
            console.log(e);
        }
    },
    updateItem: async<T>(collection:string, object:T)=>{
        try {
            let list:T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            list = list.filter( item => (item as Identified)._id === (object as Identified)._id)
            list.push(object)
            await AsyncStorage.setItem(collection, JSON.stringify(list))
        } catch (error) {
            console.log(error);
        }
    },
    updateLocalItem: async<T>(collection:string, object:T)=>{
        try {
            let list:T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            list = list.filter( item => (item as Identified).id === (object as Identified).id)
            list.push(object)
            await AsyncStorage.setItem(collection, JSON.stringify(list))
        } catch (error) {
            console.log(error);
        }
    },
    deleteItem: async<T>(collection:string, id:string) => {
        try {
            let list: T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            list = list.filter(item => (item as Identified).id === id)
            await AsyncStorage.setItem(collection, JSON.stringify(list))
        } catch (e) {
            console.log(e);
        }
    },
    deleteLocalItem: async<T>(collection:string, id:string) => {
        try {
            let list: T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            list = list.filter(item => (item as Identified)._id === id)
            await AsyncStorage.setItem(collection, JSON.stringify(list))
        } catch (e) {
            console.log(e);
        }
    },
    getCollection: async<T>(collection:string) =>{
        try {
            const list : T[] = JSON.parse(await AsyncStorage.getItem(collection) as string)
            return list
        } catch (e) {
            console.log(e)
        }
    }
    

}

export default DB