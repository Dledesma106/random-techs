import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Text, View, Pressable, ViewProps } from 'react-native';

import { useTasksListQuery } from './queries';

import { TaskStatus } from '@/api/graphql';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HomeTabScreenProp } from '@/navigation/types';

type TaskItem = NonNullable<Props['tasksQuery']['data']>['myAssignedTasks'][0];

type Props = Pick<HomeTabScreenProp, 'navigation'> & {
    tasksQuery: ReturnType<typeof useTasksListQuery>;
};

const TasksList = ({ navigation, tasksQuery }: Props) => {
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.Pendiente);

    const filteredTasks = tasksQuery.data?.myAssignedTasks.filter((task) => {
        if (taskStatus === null) {
            return true;
        }

        return task.status === taskStatus;
    });

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
    task: TaskItem;
    navigation: Props['navigation'];
    style?: ViewProps['style'];
};

const Item = ({ task, navigation, style }: ItemProps) => {
    const branch = task.branch;
    const client = branch.client;

    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            className={cn(
                'flex flex-col items-start rounded-lg border border-border p-3 text-left text-sm transition-all',
                isPressed && 'bg-accent',
            )}
            onPress={() => {
                navigation.navigate('Task', {
                    id: task.id,
                });
            }}
            onPressIn={() => {
                setIsPressed(true);
            }}
            onPressOut={() => {
                setIsPressed(false);
            }}
            style={style}
        >
            <View className="flex w-full flex-col mb-2">
                <View className="flex flex-row items-center mb-1">
                    <View className="flex flex-row items-center">
                        <Text className="font-semibold">{task.business.name}</Text>
                    </View>
                    <Text className={cn('ml-auto text-xs', 'text-muted-foreground')}>
                        hace{' '}
                        {formatDistance(task.createdAt, new Date(), {
                            locale: es,
                        })}
                    </Text>
                </View>

                <Text className="text-xs font-medium">{client.name}</Text>
            </View>

            <Text numberOfLines={2} className="text-xs text-muted-foreground mb-2">
                {task.description}
            </Text>

            <Badge>
                <BadgeText>{task.taskType}</BadgeText>
            </Badge>
        </Pressable>
    );
};

export default TasksList;
