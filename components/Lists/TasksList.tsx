import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { ITask } from "../../models/interfaces";
import fetcher from "../../lib/fetcher";
import * as apiEndpoints from '../../lib/apiEndpoints'


export default function TasksList(){
    const [tasks, setTasks] = useState<ITask[]>([])
    const getTasks = async()=>{return await fetcher(apiEndpoints.tech.tasks, {}, 'GET')}

    useEffect(()=>{
        getTasks().then(data => {
            setTasks(data.tasks)
        })
    },[] )
    
    return (
        <>
            <View>
                <FlatList data={tasks} renderItem={({item}) => <TaskItem task={item as ITask}/>}/>
            </View>
        </>
    )
}

function TaskItem({task}:{task:ITask}){

    
    return(
        <>
            <View className="flex flex-col border-2">
                <Text>{task.branch.client.name} - {task.branch.number} - {task.business.name}</Text>
                <Text>{task.description}</Text>
            </View>

        </>
    )
}