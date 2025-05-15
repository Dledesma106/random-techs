import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Text, View, Pressable, ViewProps } from 'react-native';

import { MyAssignedTasksQuery, TaskType } from '@/api/graphql';
import TaskTypeBadge from '@/components/TaskTypeBadge';
import { cn } from '@/lib/utils';

import { TaskListProps } from '.';

type TaskItem = NonNullable<MyAssignedTasksQuery['myAssignedTasks']>[0];

type ItemProps = {
    task: TaskItem;
    navigation: TaskListProps['navigation'];
    style?: ViewProps['style'];
};

const getTaskTypeBorderColor = (type: TaskType) => {
    switch (type) {
        case TaskType.Preventivo:
            return 'border-green-500';
        case TaskType.Correctivo:
            return 'border-red-500';
        case TaskType.Instalacion:
            return 'border-blue-500';
        case TaskType.Desmonte:
            return 'border-yellow-500';
        case TaskType.Actualizacion:
            return 'border-purple-500';
        case TaskType.InspeccionPolicial:
            return 'border-orange-500';
        default:
            return 'border-gray-500';
    }
};

const Item = ({ task, navigation, style }: ItemProps) => {
    const branch = task.branch;
    const [isPressed, setIsPressed] = useState(false);
    const borderColor = getTaskTypeBorderColor(task.taskType);

    return (
        <Pressable
            className={cn(
                'flex flex-col items-start rounded-lg border-2 p-3 text-left text-sm transition-all',
                borderColor,
                isPressed && 'bg-accent',
            )}
            onPress={() => {
                navigation.navigate('AssignedTask', {
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
                        <Text className="font-semibold">
                            #{task.taskNumber} -{' '}
                            {task.business?.name ?? task.businessName}
                        </Text>
                    </View>
                    <Text className={cn('ml-auto text-xs', 'text-muted-foreground')}>
                        hace{' '}
                        {formatDistance(task.createdAt, new Date(), {
                            locale: es,
                        })}
                    </Text>
                </View>
                <View className="flex flex-row items-center mb-1">
                    <Text className="text-xs font-medium">
                        {branch !== null
                            ? `${branch?.client?.name} ${branch?.number ? `${branch.number}, ` : ''}${branch?.name ? `${branch.name}, ` : ''}${branch?.city?.name ?? ''}`
                            : `${task.clientName}`}
                    </Text>
                </View>
            </View>

            <Text numberOfLines={2} className="text-xs text-muted-foreground mb-2">
                {task.description}
            </Text>

            <TaskTypeBadge type={task.taskType} />
        </Pressable>
    );
};

export default Item;
