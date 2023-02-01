import { createContext} from 'react';


//Database API, it uses AsyncStorage to save the technician's tasks, expenses, activities and all the other entities necessary for registering new tasks

interface DbContextProps{

}

const DbContext = createContext<DbContextProps>({} as DbContextProps)

export default DbContext
