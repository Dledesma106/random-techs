import { Text, TouchableOpacity, View } from 'react-native';

import Item from './Item';

import RefreshableScroll from '@/components/RefreshableScroll';
import Header from '@/components/ui/Header';
import { useGetMyExpenses } from '@/hooks/api/expense/useGetMyExpenses';
import { cn } from '@/lib/utils';
import { ExpensesListScreenProp } from '@/navigation/types';

const ExpensesList = ({ navigation }: ExpensesListScreenProp) => {
    const { data: expenses, isFetching, refetch, isLoading } = useGetMyExpenses();

    if (isLoading)
        return (
            <View className="my-4">
                <Header title="Cargando..." />
            </View>
        );

    return (
        <RefreshableScroll isRefreshing={isFetching} onRefresh={refetch}>
            <View className="px-4 space-y-2">
                <TouchableOpacity
                    onPress={() => navigation.navigate('RegisterExpense')}
                    className="p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1 relative"
                >
                    <Text className={cn('font-bold text-white')}>Registrar gasto</Text>
                </TouchableOpacity>
                {expenses?.myExpenses?.map((expense) => (
                    <Item
                        key={expense.id}
                        expense={expense}
                        onPress={() =>
                            navigation.navigate('Expense', { expenseId: expense.id })
                        }
                    />
                ))}
                {expenses?.myExpenses?.length === 0 && (
                    <View className="flex flex-col items-center justify-center">
                        <Text className="text-slate-500">No hay gastos para mostrar</Text>
                    </View>
                )}
            </View>
        </RefreshableScroll>
    );
};

export default ExpensesList;
