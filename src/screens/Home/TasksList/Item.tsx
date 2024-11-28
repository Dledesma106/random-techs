import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Text, View, Pressable, ViewProps } from 'react-native';

import { Badge, BadgeText } from '@/components/ui/badge';
import { cn, pascalCaseToSpaces } from '@/lib/utils';

import { TaskListProps } from '.';

type TaskItem = NonNullable<TaskListProps['tasksQuery']['data']>['myAssignedTasks'][0];

type ItemProps = {
    task: TaskItem;
    navigation: TaskListProps['navigation'];
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
                        <Text className="font-semibold">{task.business.name}</Text>
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
                        {client.name} {branch.number}, {branch.city.name}
                    </Text>
                </View>
            </View>

            <Text numberOfLines={2} className="text-xs text-muted-foreground mb-2">
                {task.description}
            </Text>

            <Badge>
                <BadgeText>{pascalCaseToSpaces(task.taskType)}</BadgeText>
            </Badge>
        </Pressable>
    );
};

export default Item;
