import { IUser } from "./interfaces";
import DB from "../lib/DB";
import bcryptjs from 'bcryptjs'
const collection='User'
const unsynched='Unsynched'+collection

async function userWithHashedPassword(user:IUser, password:string){
    const hash = bcryptjs.hashSync(password, 6)
    user.password = hash
    return user
}


//export function validatePassword(user:IUser, )

const User = {
    get: async(id:string) =>{
        return await DB.secureRead<IUser>(collection, id)
    },
    set: async(user:IUser, password:string, newPassword:string = '')=>{
        //console.log('setting user');
        
        const readUser = await DB.secureRead<IUser>(collection, user._id as string)
        if(!readUser){
            //console.log('no user found when setting user, creating user with hashed password')
            await DB.secureCreate(collection, await userWithHashedPassword(user, password))
        }
        if(!(newPassword.length>0)) return //console.log('user found but no new password set, returning with no changes')
        //console.log('setting user with new password')

        await DB.secureUpdate<IUser>(collection, await userWithHashedPassword(user, newPassword))
    },
    delete: async(id:string) =>{
        await DB.secureDelete<IUser>(collection, id)
    },
    getAll: async() => {
        return await DB.secureGetCollection<IUser>(collection)
    },
    setUnsynched: async(user:IUser)=>{
        if(!await DB.secureRead(unsynched, user._id as string))return await DB.secureCreate(unsynched, user)
        return await DB.secureUpdate<IUser>(unsynched, user)
    },
    deleteUnsynched: async(id:string) =>{
        return await DB.secureDelete<IUser>(unsynched, id)
    },
    getAllUnsynched: async() => {
        return await DB.secureGetCollection<IUser>(unsynched)
    },
    markAsSynched: async(user:IUser) => {
        await DB.secureDelete(unsynched, user._id as string)
        await DB.secureCreate(collection, user)
    },
    markAsUnsynched: async(user:IUser) => {
        await DB.secureDelete(collection, user._id as string)
        await DB.secureCreate(unsynched, user)
    },

}

export default User