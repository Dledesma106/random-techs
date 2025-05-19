import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import Item from './Item';

import { MyAssignedTasksQuery, TaskStatus, TaskType } from '@/api/graphql';
import CollapsableText from '@/components/CollapsableText';
import { Button, ButtonText } from '@/components/ui/button';
import Header from '@/components/ui/Header';
import { useGetMyAssignedTasks } from '@/hooks/api/tasks/useGetMyAssignedTasks';
import { cn, stringifyObject } from '@/lib/utils';
import { HomeTabScreenProp } from '@/navigation/types';
const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';

export type TaskListProps = Pick<HomeTabScreenProp, 'navigation'>;

type FilterButton = {
    id: string;
    label: string;
    value: TaskStatus | boolean;
    isActive: boolean;
};

const TasksList = ({ navigation }: TaskListProps) => {
    const tasksQuery = useGetMyAssignedTasks();
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.Pendiente);
    const [isPreventive, setIsPreventive] = useState<boolean>(false);
    const [filteredTasks, setFilteredTasks] = useState<
        MyAssignedTasksQuery['myAssignedTasks']
    >([]);

    // Configuración de los botones de tipo de tarea
    const typeButtons: FilterButton[] = [
        {
            id: 'tasks',
            label: 'Tareas',
            value: false,
            isActive: !isPreventive,
        },
        {
            id: 'preventive',
            label: 'Preventivos',
            value: true,
            isActive: isPreventive,
        },
    ];

    // Configuración de los botones de estado
    const statusButtons: FilterButton[] = [
        {
            id: 'pending',
            label: 'Pendientes',
            value: TaskStatus.Pendiente,
            isActive: taskStatus === TaskStatus.Pendiente,
        },
        {
            id: 'finished',
            label: 'Finalizadas',
            value: TaskStatus.Finalizada,
            isActive: taskStatus === TaskStatus.Finalizada,
        },
        {
            id: 'approved',
            label: 'Aprobadas',
            value: TaskStatus.Aprobada,
            isActive: taskStatus === TaskStatus.Aprobada,
        },
    ];

    // Actualizar las tareas filtradas cuando cambien los datos o el estado del filtro
    useEffect(() => {
        if (tasksQuery.data) {
            const newFilteredTasks = tasksQuery.data.myAssignedTasks.filter((task) => {
                // Filtrar por estado
                const matchesStatus = task.status === taskStatus;
                // Filtrar por tipo (preventivo o no preventivo)
                const isPreventiveTask = task.taskType === TaskType.Preventivo;
                const matchesType = isPreventive ? isPreventiveTask : !isPreventiveTask;

                return matchesStatus && matchesType;
            });
            setFilteredTasks(newFilteredTasks);
        }
    }, [tasksQuery.data, taskStatus, isPreventive]);

    const handleTypeChange = (value: boolean) => {
        setIsPreventive(value);
    };

    const handleStatusChange = (value: TaskStatus) => {
        setTaskStatus(value);
    };

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
                        {typeButtons.map((button) => (
                            <Button
                                key={button.id}
                                onPress={() => handleTypeChange(button.value as boolean)}
                                className={cn('flex-1', button.isActive && 'bg-black')}
                                variant="secondary"
                            >
                                <ButtonText
                                    className={cn(
                                        button.isActive && 'font-bold text-white',
                                    )}
                                >
                                    {button.label}
                                </ButtonText>
                            </Button>
                        ))}
                    </View>
                    <View className="mb-4 flex flex-row divide-x divide-gray-100 px-4 space-x-3">
                        {statusButtons.map((button) => (
                            <Button
                                key={button.id}
                                onPress={() =>
                                    handleStatusChange(button.value as TaskStatus)
                                }
                                className={cn('flex-1', button.isActive && 'bg-black')}
                                variant="secondary"
                            >
                                <ButtonText
                                    className={cn(
                                        button.isActive && 'font-bold text-white',
                                    )}
                                >
                                    {button.label}
                                </ButtonText>
                            </Button>
                        ))}
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
