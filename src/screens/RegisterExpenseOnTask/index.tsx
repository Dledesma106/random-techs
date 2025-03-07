import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { ExpenseInput } from '@/api/graphql';
import ExpenseForm from '@/components/Forms/ExpenseForm';
import { useCreateExpense } from '@/hooks/api/expense/useCreateExpense';
import { TASK_BY_ID_QUERY_KEY } from '@/hooks/api/tasks/useGetMyAssignedTaskById';
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
    const queryClient = useQueryClient();

    const createExpenseOnTask = async (expenseData: ExpenseInput) => {
        await createExpense({ taskId, expenseData });
    };

    const handleFinish = async (expenseData: ExpenseInput) => {
        try {
            if (taskId) {
                await createExpenseOnTask(expenseData);
                queryClient.invalidateQueries({ queryKey: TASK_BY_ID_QUERY_KEY(taskId) });
            } else {
                emitRegisterExpenseOnTaskEvent(expenseData);
            }
        } catch (error) {
            // ... manejo de errores
        }
    };

    useEffect(() => {
        return () => {
            removeRegisterExpenseOnTaskListener();
        };
    }, []);

    return <ExpenseForm onFinish={handleFinish} />;
};

export default RegisterExpenseOnTask;
