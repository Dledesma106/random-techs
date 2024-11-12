import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import ExpenseDetail from '@/components/ExpenseDetail';
import { deletePhoto } from '@/lib/utils';
import { ExpenseOnTaskFormScreenRouteProp } from '@/navigation/types';

const EVENT_NAME = 'expense-deleted-on-task-event';

export const addDeleteExpenseOnTaskListener = (
    callback: (expenseImageKey: string) => void,
) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeDeleteExpenseOnTaskListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitDeleteExpenseOnTaskEvent = (expenseImageKey: string) => {
    DeviceEventEmitter.emit(EVENT_NAME, expenseImageKey);
};

const ExpenseOnTaskForm = ({ navigation, route }: ExpenseOnTaskFormScreenRouteProp) => {
    const { expense } = route.params;

    useEffect(() => {
        return () => {
            removeDeleteExpenseOnTaskListener();
        };
    }, []);

    const handleDeleteExpense = async () => {
        await deletePhoto(expense.imageKey ?? '');
        emitDeleteExpenseOnTaskEvent(expense.imageKey ?? '');
        navigation.goBack();
    };

    return <ExpenseDetail onDelete={handleDeleteExpense} expense={expense} />;
};

export default ExpenseOnTaskForm;
