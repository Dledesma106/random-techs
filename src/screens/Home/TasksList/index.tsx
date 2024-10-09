import { useState } from 'react';
import { Text, View } from 'react-native';

import Header from './Header';
import Item from './Item';

import { TaskStatus } from '@/api/graphql';
import { Button, ButtonText } from '@/components/ui/button';
import { useGetMyAssignedTasks } from '@/hooks/api/tasks/useGetMyAssignedTasks';
import { cn } from '@/lib/utils';
import { HomeTabScreenProp } from '@/navigation/types';

export type TaskListProps = Pick<HomeTabScreenProp, 'navigation'> & {
    tasksQuery: ReturnType<typeof useGetMyAssignedTasks>;
};

const TasksList = ({ navigation, tasksQuery }: TaskListProps) => {
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.Pendiente);

    const filteredTasks = tasksQuery.data?.myAssignedTasks.filter((task) => {
        if (taskStatus === null) {
            return true;
        }

        return task.status === taskStatus;
    });
    console.log(tasksQuery.error);
    if (tasksQuery.data) {
        return (
            <View className="py-4 flex-1">
                <Text className="text-lg font-bold px-4 mb-2">Tareas</Text>

                <View className="mb-4 flex flex-row divide-x divide-gray-100 px-4 space-x-3">
                    <Button
                        onPress={() => {
                            setTaskStatus(TaskStatus.Pendiente);
                        }}
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
                        onPress={() => {
                            setTaskStatus(TaskStatus.Finalizada);
                        }}
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
                        onPress={() => {
                            setTaskStatus(TaskStatus.Aprobada);
                        }}
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
                    {filteredTasks?.map((task) => (
                        <Item navigation={navigation} key={task.id} task={task} />
                    ))}

                    {filteredTasks?.length === 0 && (
                        <View className="flex flex-col items-center justify-center">
                            <Text className="text-slate-500">
                                No hay tareas para mostrar
                            </Text>
                        </View>
                    )}
                </View>
            </View>
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
