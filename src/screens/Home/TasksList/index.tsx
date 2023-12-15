import { Feather } from '@expo/vector-icons';
import { Text, View, Pressable } from 'react-native';

import { useTasksListQuery } from './queries';

import { HomeTabScreenProp } from '@/navigation/types';

import { IBranch, IClient, ITask } from '../../../models/interfaces';

type Props = Pick<HomeTabScreenProp, 'navigation'>;

const TasksList = ({ navigation }: Props) => {
    const tasksQuery = useTasksListQuery();

    // const { getTasksByStatus, refreshTasks } = useDb();

    // const getAllTasks = async () => {
    //     const tasks = await getTasksByStatus('Pendiente');
    //     setTasks(tasks);
    // };

    // async function refresh() {
    //     await refreshTasks();
    //     await getAllTasks();
    // }
    // useEffect(() => {
    //     getAllTasks();
    // }, []);

    const card = 'flex flex-col w-11/12 mx-auto my-4 bg-gray-50 rounded-3xl';
    if (tasksQuery.data) {
        return (
            <>
                <View className={card}>
                    <Header
                        title={
                            tasksQuery.data.length > 0
                                ? 'Tareas pendientes'
                                : 'No tiene tareas pendientes'
                        }
                        refresh={tasksQuery.refetch}
                    />

                    {tasksQuery.data.map((task) => (
                        <Item navigation={navigation} key={task._id} task={task} />
                    ))}
                </View>
            </>
        );
    }

    if (tasksQuery.error) {
        return (
            <View className={card}>
                <Header title="Error al cargar las tareas" refresh={tasksQuery.refetch} />
            </View>
        );
    }

    return (
        <View className={card}>
            <Header title="Cargando..." refresh={tasksQuery.refetch} />
        </View>
    );
};

type HeaderProps = {
    title: string;
    refresh: () => void;
};

const Header = ({ title, refresh }: HeaderProps) => (
    <View className="flex flex-row items-center justify-between p-4 rounded-t-3xl">
        <Text>{title}</Text>
        <Pressable onPress={refresh}>
            <Feather name="refresh-cw" size={20} color="black" />
        </Pressable>
    </View>
);

type ItemProps = {
    task: ITask;
    navigation: Props['navigation'];
};

const Item = ({ task, navigation }: ItemProps) => {
    function navigate() {
        navigation.navigate('Task', { task });
    }

    const branch = task.branch as IBranch;
    const client = branch.client as IClient;

    return (
        <Pressable className="px-4 border-t py-4" onPress={navigate}>
            <Text>{client.name}</Text>
            <Text>{branch.number}</Text>
            <Text>{task.business.name}</Text>
            <Text>{task.taskType}</Text>
            <Text>{task.description}</Text>
        </Pressable>
    );
};

export default TasksList;
