import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import Item from './Item';

import { MyAssignedTasksQuery, TaskStatus } from '@/api/graphql';
import CollapsableText from '@/components/CollapsableText';
import { Button, ButtonText } from '@/components/ui/button';
import Header from '@/components/ui/Header';
import { useGetMyAssignedTasks } from '@/hooks/api/tasks/useGetMyAssignedTasks';
import { cn, stringifyObject } from '@/lib/utils';
import { HomeTabScreenProp } from '@/navigation/types';
const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';

export type TaskListProps = Pick<HomeTabScreenProp, 'navigation'>;

const TasksList = ({ navigation }: TaskListProps) => {
    const tasksQuery = useGetMyAssignedTasks();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.Pendiente);
    const [filteredTasks, setFilteredTasks] = useState<
        MyAssignedTasksQuery['myAssignedTasks']
    >([]);

    // Actualizar las tareas filtradas cuando cambien los datos o el estado del filtro
    useEffect(() => {
        if (tasksQuery.data) {
            const newFilteredTasks = tasksQuery.data.myAssignedTasks.filter((task) => {
                return task.status === taskStatus;
            });
            setFilteredTasks(newFilteredTasks);
        }
    }, [tasksQuery.data, taskStatus]);

    if (tasksQuery.data) {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={tasksQuery.isFetching}
                        onRefresh={tasksQuery.refetch}
                    />
                }
                className="bg-white flex-1"
            >
                <View className="py-4 flex-1">
                    {isDevelopment && (
                        <CollapsableText
                            buttonText="datos de desarrollo"
                            text={stringifyObject(filteredTasks)}
                        />
                    )}
                    <View className="mb-4 flex flex-row divide-x divide-gray-100 px-4 space-x-3">
                        <Button
                            onPress={() => setTaskStatus(TaskStatus.Pendiente)}
                            className="flex-1"
                            variant="secondary"
                        >
                            <ButtonText
                                className={cn(
                                    taskStatus === TaskStatus.Pendiente && 'font-bold',
                                )}
                            >
                                Pendientes
                            </ButtonText>
                        </Button>

                        <Button
                            onPress={() => setTaskStatus(TaskStatus.Finalizada)}
                            className="flex-1"
                            variant="secondary"
                        >
                            <ButtonText
                                className={cn(
                                    taskStatus === TaskStatus.Finalizada && 'font-bold',
                                )}
                            >
                                Finalizadas
                            </ButtonText>
                        </Button>

                        <Button
                            onPress={() => setTaskStatus(TaskStatus.Aprobada)}
                            className="flex-1"
                            variant="secondary"
                        >
                            <ButtonText
                                className={cn(
                                    taskStatus === TaskStatus.Aprobada && 'font-bold',
                                )}
                            >
                                Aprobadas
                            </ButtonText>
                        </Button>
                    </View>

                    <View className="px-4 space-y-2">
                        {filteredTasks.map((task) => (
                            <Item navigation={navigation} key={task.id} task={task} />
                        ))}

                        {filteredTasks.length === 0 && (
                            <View className="flex flex-col items-center justify-center">
                                <Text className="text-slate-500">
                                    No hay tareas para mostrar
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }

    if (tasksQuery.error) {
        return (
            <View className="my-4">
                <Header
                    title="Error al cargar las tareas"
                    description={tasksQuery.error.message}
                />
            </View>
        );
    }

    return (
        <View className="my-4">
            <Header title="Cargando..." />
        </View>
    );
};

export default TasksList;
