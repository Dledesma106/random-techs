import { FontAwesome5 } from '@expo/vector-icons';
import clsx from 'clsx';
import { useState } from 'react';
import { Text, View, Pressable, ViewProps } from 'react-native';

import { TasksListQueryDataIem, useTasksListQuery } from './queries';

import { TaskType } from '@/models/types';
import { HomeTabScreenProp } from '@/navigation/types';

type Props = Pick<HomeTabScreenProp, 'navigation'> & {
    tasksQuery: ReturnType<typeof useTasksListQuery>;
};

const TasksList = ({ navigation, tasksQuery }: Props) => {
    if (tasksQuery.data) {
        return (
            <View className="my-4">
                <Header
                    title={
                        tasksQuery.data.length > 0
                            ? 'Tareas pendientes'
                            : 'No tiene tareas pendientes'
                    }
                />

                <View className="px-4 space-y-2">
                    {tasksQuery.data.map((task) => (
                        <Item navigation={navigation} key={task._id} task={task} />
                    ))}
                </View>
            </View>
        );
    }

    if (tasksQuery.error) {
        return (
            <View className="my-4">
                <Header title="Error al cargar las tareas" />
            </View>
        );
    }

    return (
        <View className="my-4">
            <Header title="Cargando..." />
        </View>
    );
};

type HeaderProps = {
    title: string;
};

const Header = ({ title }: HeaderProps) => {
    return (
        <View className="flex flex-row items-center justify-between px-4 mb-4">
            <Text className="font-bold text-lg">{title}</Text>
        </View>
    );
};

type ItemProps = {
    task: TasksListQueryDataIem;
    navigation: Props['navigation'];
    style?: ViewProps['style'];
};

type TaskTypeProps = {
    type: TaskType;
};

const TaskTypeBadge: React.FC<TaskTypeProps> = ({ type }) => {
    if (type === TaskType.Actualizacion) {
        return (
            <View className="bg-yellow-200 rounded-full px-2 py-1">
                <Text className="text-sm">Actualizacion</Text>
            </View>
        );
    }

    if (type === TaskType.Correctivo) {
        return (
            <View className="bg-red-500 rounded-full px-2 py-1">
                <Text className="text-white text-sm">Correctivo</Text>
            </View>
        );
    }

    if (type === TaskType.Desmonte) {
        return (
            <View className="bg-blue-500 rounded-full px-2 py-1">
                <Text className="text-white text-sm">Desmonte</Text>
            </View>
        );
    }

    if (type === TaskType.Instalacion) {
        return (
            <View className="bg-green-500 rounded-full px-2 py-1">
                <Text className="text-white text-sm">Instalacion</Text>
            </View>
        );
    }

    if (type === TaskType.Preventivo) {
        return (
            <View className="bg-purple-500 rounded-full px-2 py-1">
                <Text className="text-white text-sm">Preventivo</Text>
            </View>
        );
    }

    return null;
};

const Item = ({ task, navigation, style }: ItemProps) => {
    function navigate() {
        navigation.navigate('Task', {
            id: task._id,
        });
    }

    const [isPressed, setIsPressed] = useState(false);

    const branch = task.branch;
    const client = branch.client;

    return (
        <View style={style}>
            <Pressable
                className="group bg-white active:bg-black p-4 rounded-xl"
                onPress={navigate}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            >
                <View className="flex flex-row space-x-2 items-start justify-between mb-2">
                    <View>
                        <Text
                            className={clsx(isPressed ? 'text-white' : 'text-slate-500')}
                        >
                            {task.business.name}
                        </Text>

                        <Text
                            className={clsx(
                                'font-bold text-lg',
                                isPressed && 'text-white',
                            )}
                        >
                            {client.name}
                        </Text>
                    </View>

                    <TaskTypeBadge type={task.taskType} />
                </View>

                <Text
                    className={clsx('mb-2', isPressed ? 'text-white' : 'text-slate-500')}
                >
                    {task.description}
                </Text>

                <View className="flex flex-row justify-between">
                    <Text className={clsx(isPressed ? 'text-white' : 'text-slate-500')}>
                        {task.status}
                    </Text>

                    <View className="flex flex-row space-x-2 items-center justify-end">
                        <FontAwesome5
                            name="warehouse"
                            size={12}
                            color={isPressed ? 'white' : '#666'}
                        />
                        <Text
                            className={clsx(isPressed ? 'text-white' : 'text-slate-500')}
                        >
                            #{branch.number}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default TasksList;
