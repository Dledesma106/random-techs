import { useEffect, useState } from "react";
import { Text, View, FlatList, Pressable, Button } from "react-native";
import { ITask } from "../../models/interfaces";
import fetcher from "../../lib/fetcher";
import * as apiEndpoints from '../../lib/apiEndpoints'
import { Feather } from '@expo/vector-icons'; 
import { useDB } from "../../hooks/useDB";


export default function TasksList(){
    const [tasks, setTasks] = useState<ITask[]>([])
    const {getTasks, refreshTasks} = useDB()
    //const [isLoading, setIsLoading] = useState<boolean>(false)

    const getAllTasks = async () =>{
        const tasks = await getTasks()
        setTasks(tasks)
    }

    async function refresh(){
        await refreshTasks()
        await getAllTasks()
        
    }
    useEffect(()=>{
        getAllTasks()
    },[])
    
    return (
        <>
            <View className="flex flex-col  rounded-md w-11/12 mx-auto my-4">
                <ListTitle title={tasks?'Tareas pendientes':'No tiene tareas pendientes'} refresh={refresh}/>
                <View className="bg-gray-100 rounded-b-md"> 
                        <FlatList data={tasks} renderItem={({item}) => <TaskItem task={item as ITask}/>}/>
                </View>
            </View>
            
        </>
    )
}

function ListTitle({title, refresh}:{title:string, refresh:()=>void}){
    return (
        <View className="flex flex-row items-center justify-between bg-blue-500 p-1 rounded-b-none rounded-t-md">
            <Text className="text-lg">{title}</Text>
            <Pressable onPress={refresh}>
                <Feather name="refresh-cw" size={20} color="black" />
            </Pressable>
        </View>
    )
}


function TaskItem({task}:{task:ITask}){
    
    return(
        <>
            <View className='flex flex-col p-2'>
                <Text className='bg-blue-500 p-1'>{task.branch.client.name} - {task.branch.number} - {task.business.name}</Text>
                <View className='bg-slate-300 p-1'>
                    <Text>{task.taskType}</Text>
                    <Text>{task.description}</Text>
                </View>
            </View>

        </>
    )
}