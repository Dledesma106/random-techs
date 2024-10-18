import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import { ExpenseOnTaskFormScreenRouteProp } from '@/navigation/types';

import { format } from 'date-fns';
import { EvilIcons } from '@expo/vector-icons';
import ConfirmButton from '@/components/ConfirmButton';
import { useEffect } from 'react';
import { deletePhoto } from '@/lib/utils';

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
    const {
        expense: { amount, paySource, expenseType, image },
    } = route.params;

    useEffect(() => {
        return () => {
            removeDeleteExpenseOnTaskListener();
        };
    }, []);

    const handleDeleteExpense = async () => {
        await deletePhoto(image?.key ?? '');
        emitDeleteExpenseOnTaskEvent(image?.key ?? '');
        navigation.goBack();
    };

    return (
        <ScrollView className="bg-white h-screen">
            <View className="px-4 py-4">
                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                    <Text className="text-gray-600">${amount.toLocaleString()}</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Tipo</Text>
                    <Text className="text-gray-600">{expenseType}</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Fuente de pago</Text>
                    <Text className="text-gray-600">{paySource}</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Fecha</Text>
                    <Text className="text-gray-600">
                        {format(new Date(), 'dd/MM/yyyy')}
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Imagen</Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('FullScreenImage', {
                                uri: image?.uri ?? '',
                            })
                        }
                        className="mx-auto w-8/12"
                    >
                        <Image
                            className="bg-gray-200 mb-14"
                            source={{ uri: image?.uri }}
                            style={{
                                borderRadius: 6,
                                aspectRatio: 9 / 16,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ConfirmButton
                title="Eliminar Gasto"
                confirmMessage="¿Seguro que quiere eliminar el gasto?"
                onConfirm={handleDeleteExpense}
                icon={<EvilIcons name="trash" size={22} color="white" />}
            />
        </ScrollView>
    );
};

export default ExpenseOnTaskForm;
