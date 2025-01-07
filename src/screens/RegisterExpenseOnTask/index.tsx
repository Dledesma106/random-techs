import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { ExpenseInput } from '@/api/graphql';
import ExpenseForm from '@/components/Forms/ExpenseForm';
import { useCreateExpense } from '@/hooks/api/expense/useCreateExpense';
import { RootStackScreenProps } from '@/navigation/types';

const EVENT_NAME = 'expense-registered-on-task-event';

export const addRegisterExpenseOnTaskListener = (
    callback: (expense: ExpenseInput) => void,
) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeRegisterExpenseOnTaskListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitRegisterExpenseOnTaskEvent = (expense: ExpenseInput) => {
    DeviceEventEmitter.emit(EVENT_NAME, expense);
};

const RegisterExpenseOnTask = ({
    route,
}: RootStackScreenProps<'RegisterExpenseOnTask'>) => {
    const { taskId } = route.params;
    const { mutateAsync: createExpense } = useCreateExpense();
    const createExpenseOnTask = async (expenseData: ExpenseInput) => {
        await createExpense({ taskId, expenseData });
    };

    const onFinish = async (expenseData: ExpenseInput) => {
        if (taskId) {
            await createExpenseOnTask(expenseData);
        } else {
            await emitRegisterExpenseOnTaskEvent(expenseData);
        }
    };

    useEffect(() => {
        return () => {
            removeRegisterExpenseOnTaskListener();
        };
    }, []);

    return <ExpenseForm onFinish={onFinish} />;
};

export default RegisterExpenseOnTask;
