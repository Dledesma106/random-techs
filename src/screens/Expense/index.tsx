import { useEffect } from 'react';
import { Text, ScrollView, RefreshControl, DeviceEventEmitter } from 'react-native';

import ExpenseDetail from '@/components/ExpenseDetail';
import { useGetExpenseById } from '@/hooks/api/expense/useGetExpenseById';
import { ExpenseScreenRouteProp } from '@/navigation/types';

const EVENT_NAME = 'expense-deleted-by-id-event';

export const addDeleteExpenseByIdListener = (callback: (expenseId: string) => void) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeDeleteExpenseByIdListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitDeleteExpenseByIdEvent = (expenseId: string) => {
    DeviceEventEmitter.emit(EVENT_NAME, expenseId);
};

const Expense = ({ navigation, route }: ExpenseScreenRouteProp) => {
    const { expenseId } = route.params;
    const {
        data: expenseData,
        isFetching: isFetchingExpense,
        refetch,
        error: queryError,
    } = useGetExpenseById(expenseId);

    useEffect(() => {
        return () => {
            removeDeleteExpenseByIdListener();
        };
    }, []);

    const handleDeleteExpense = async () => {
        await emitDeleteExpenseByIdEvent(expenseId);
        navigation.goBack();
    };

    if (expenseData) {
        const expense = expenseData.myExpenseById;

        if (!expense) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isFetchingExpense}
                            onRefresh={() => refetch()}
                        />
                    }
                    className="bg-white h-screen"
                >
                    <Text>No se encontró el gasto</Text>
                </ScrollView>
            );
        }

        return <ExpenseDetail onDelete={handleDeleteExpense} expense={expense} />;
    }

    if (queryError) {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isFetchingExpense}
                        onRefresh={() => refetch()}
                    />
                }
                className="bg-white h-screen"
            >
                <Text>Error</Text>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={isFetchingExpense}
                    onRefresh={() => refetch()}
                />
            }
            className="bg-white h-screen"
        >
            <Text>Cargando...</Text>
        </ScrollView>
    );
};

export default Expense;
