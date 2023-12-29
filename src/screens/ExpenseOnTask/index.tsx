import { useEffect } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';

import { useExpenseByIdQuery } from './queries';

import { ExpenseOnTaskScreenRouteProp } from '@/navigation/types';

import { dmyDateString } from '../../lib/utils';

const ExpenseOnTask = ({ route }: ExpenseOnTaskScreenRouteProp) => {
    const { expenseId } = route.params;
    const expenseQueryResult = useExpenseByIdQuery(expenseId);

    useEffect(() => {
        expenseQueryResult.refetch();
    }, []);

    if (expenseQueryResult.data && !Array.isArray(expenseQueryResult.data)) {
        const expense = expenseQueryResult.data;

        return (
            <ScrollView className="bg-white h-screen">
                <View className="px-4 py-4">
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                        <Text className="text-gray-600">
                            ${expense.amount.toLocaleString()}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Tipo</Text>
                        <Text className="text-gray-600">{expense.expenseType}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Tipo de pago</Text>
                        <Text className="text-gray-600">{expense.paySource}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Fecha</Text>
                        <Text className="text-gray-600">
                            {dmyDateString(new Date(expense.createdAt))}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Estado</Text>
                        <Text className="text-gray-600">{expense.status}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Auditor</Text>
                        <Text className="text-gray-600">
                            {expense.auditor ? expense.auditor.name : 'Sin asignar'}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Imagen</Text>

                        <View className="mx-auto w-8/12">
                            <Image
                                className="bg-gray-200"
                                source={{ uri: expense.image.url }}
                                style={{
                                    borderRadius: 6,
                                    aspectRatio: 9 / 16,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    if (expenseQueryResult.error) {
        return (
            <View>
                <Text>Error</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Cargando...</Text>
        </View>
    );
};

export default ExpenseOnTask;
