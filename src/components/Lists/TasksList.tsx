import { AntDesign, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';

import { useDb } from '../../hooks/useDB';
import { IBranch, IClient, ITask } from '../../models/interfaces';
//import fetcher from '../../lib/fetcher'
//import * as apiEndpoints from '../../lib/apiEndpoints'

export default function TasksList({ navigation }: { navigation: any }) {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const { getTasksByStatus, refreshTasks } = useDb();
    //const [isLoading, setIsLoading] = useState<boolean>(false)

    const getAllTasks = async () => {
        const tasks = await getTasksByStatus('Pendiente');
        setTasks(tasks);
    };

    async function refresh() {
        await refreshTasks();
        await getAllTasks();
    }
    useEffect(() => {
        getAllTasks();
    }, []);

    const card = 'flex flex-col w-11/12 mx-auto my-4 bg-gray-50 rounded-3xl';

    return (
        <>
            <View className={card}>
                <Header
                    title={tasks ? 'Tareas pendientes' : 'No tiene tareas pendientes'}
                    refresh={refresh}
                />
                {tasks.map((task, index) => (
                    <Item navigation={navigation} key={index} task={task} />
                ))}
            </View>
        </>
    );
}

function Header({ title, refresh }: { title: string; refresh: () => void }) {
    return (
        <View className="flex flex-row items-center justify-between p-4 rounded-t-3xl">
            <Text className="text-lg">{title}</Text>
            <Pressable onPress={refresh}>
                <Feather name="refresh-cw" size={20} color="black" />
            </Pressable>
        </View>
    );
}

function Item({ task, navigation }: { task: ITask; navigation: any }) {
    function navigate() {
        navigation.navigate('Task', { task });
    }
    return (
        <>
            <Pressable onPress={navigate}>
                <View className="flex flex-row border-t-2 items-center justify-between p-2">
                    <View className={'flex flex-col p-2 w-3/4'}>
                        <Text className="text-md">
                            {((task.branch as IBranch).client as IClient).name} -{' '}
                            {(task.branch as IBranch).number} - {task.business.name}
                        </Text>
                        <Text>{task.taskType}</Text>
                        <Text>{task.description}</Text>
                    </View>
                    <AntDesign name="right" size={24} color="black" />
                </View>
            </Pressable>
        </>
    );
}
