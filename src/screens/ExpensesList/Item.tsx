import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { Text, View, Pressable, ViewProps } from 'react-native';

import { useDeleteExpenseById } from '@/hooks/api/expense/useDeleteExpenseById';
import { useGetMyExpenses } from '@/hooks/api/expense/useGetMyExpenses';
import { cn } from '@/lib/utils';

import { addDeleteExpenseByIdListener } from '../Expense';

type ElementType<T> = T extends (infer U)[] ? U : never;

type ExpenseItem = ElementType<
    NonNullable<ReturnType<typeof useGetMyExpenses>['data']>['myExpenses']
>;

type ItemProps = {
    expense: ExpenseItem;
    onPress: () => void;
    style?: ViewProps['style'];
};

const Item = ({ expense, onPress, style }: ItemProps) => {
    const [isPressed, setIsPressed] = useState(false);
    const { mutateAsync: deleteExpense } = useDeleteExpenseById(expense.id);
    const deleteExpenseById = (expenseId: string) => {
        deleteExpense({ id: expenseId, taskId: '' });
    };
    const handlePress = () => {
        addDeleteExpenseByIdListener(deleteExpenseById);
        onPress();
    };
    if (expense === null) return;
    return (
        <Pressable
            className={cn(
                'flex flex-col items-start rounded-lg border border-border p-3 text-left text-sm transition-all',
                isPressed && 'bg-accent',
            )}
            onPress={handlePress}
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
                            ${expense.amount.toLocaleString('es-AR')}
                        </Text>
                    </View>
                    <Text className={cn('ml-auto text-xs', 'text-muted-foreground')}>
                        hace{' '}
                        {formatDistance(expense.createdAt, new Date(), {
                            locale: es,
                        })}
                    </Text>
                </View>

                <Text className="text-xs font-medium">{expense.expenseType}</Text>
            </View>

            <Text numberOfLines={2} className="text-xs text-muted-foreground mb-2">
                {expense.paySource}
            </Text>
        </Pressable>
    );
};

export default Item;
