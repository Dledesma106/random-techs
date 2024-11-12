import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { ExpenseInput } from '@/api/graphql';
import ExpenseForm from '@/components/Forms/ExpenseForm';

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

const RegisterExpenseOnTask = () => {
    useEffect(() => {
        return () => {
            removeRegisterExpenseOnTaskListener();
        };
    }, []);

    return (
        <ExpenseForm
            onFinish={async (data) => await emitRegisterExpenseOnTaskEvent(data)}
        />
    );
};

export default RegisterExpenseOnTask;
