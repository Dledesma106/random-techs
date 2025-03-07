import { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { TaskStatus } from '@/api/graphql';
import ExpenseDetail from '@/components/ExpenseDetail';
import { deletePhoto } from '@/lib/utils';
import { ExpenseOnTaskFormScreenRouteProp } from '@/navigation/types';
const EVENT_NAME = 'expense-deleted-on-task-event';

export const addDeleteExpenseOnTaskListener = (callback: (expenseId: string) => void) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeDeleteExpenseOnTaskListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitDeleteExpenseOnTaskEvent = (expenseId: string) => {
    DeviceEventEmitter.emit(EVENT_NAME, expenseId);
};

const ExpenseOnTaskForm = ({ navigation, route }: ExpenseOnTaskFormScreenRouteProp) => {
    const { expense } = route.params;

    useEffect(() => {
        return () => {
            removeDeleteExpenseOnTaskListener();
        };
    }, []);

    const handleDeleteExpense = async () => {
        // Eliminar todas las imágenes asociadas al gasto
        if (expense.imageKeys && expense.imageKeys.length > 0) {
            for (const imageKey of expense.imageKeys) {
                if (imageKey) await deletePhoto(imageKey);
            }
        }

        // Eliminar todos los archivos asociados al gasto
        if (expense.fileKeys && expense.fileKeys.length > 0) {
            for (const fileKey of expense.fileKeys) {
                if (fileKey) await deletePhoto(fileKey);
            }
        }

        // Usar un ID único para el gasto (puede ser un ID temporal generado)
        const expenseId = expense.imageKeys?.[0] || expense.fileKeys?.[0] || '';

        emitDeleteExpenseOnTaskEvent(expenseId);
        navigation.goBack();
    };

    return (
        <ExpenseDetail
            onDelete={handleDeleteExpense}
            expense={expense}
            canDelete={expense.task?.status !== TaskStatus.Aprobada}
        />
    );
};

export default ExpenseOnTaskForm;
