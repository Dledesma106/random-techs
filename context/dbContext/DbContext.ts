import { createContext} from 'react';
import { IActivity, IExpense, ITask } from '../../models/interfaces';


//Database API, it uses AsyncStorage to save the technician's tasks, expenses, activities and all the other entities necessary for registering new tasks
//it handles the save process of tasks, expenses and activities, which includes attempting to send the object to the server, and mark save to db as unsynched if it fails, and synched if it succeeds
//it also handles getting the data for rendering
interface DbContextProps{
    getTasks: ()=>Promise<ITask[]>
    getExpenses: ()=>Promise<IExpense[]>
    getActivities: ()=>Promise<IActivity[]>
    saveTask: (task:ITask)=>Promise<void>
    saveExpense: (expense:IExpense)=>Promise<void>
    saveActivity: (activity:IActivity)=>Promise<void>
}

const DbContext = createContext<DbContextProps>({} as DbContextProps)

export default DbContext
