import {
    Text,
    View,
    ScrollView,
    Image,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';

import { ExpenseOnTaskScreenRouteProp } from '@/navigation/types';

import { dmyDateString } from '../../lib/utils';
import { useGetExpenseById } from '@/hooks/api/expense/useGetExpenseById';
import { format } from 'date-fns';
import { EvilIcons } from '@expo/vector-icons';
import { useDeleteExpenseById } from '@/hooks/api/expense/useDeleteExpenseById';
import ConfirmButton from '@/components/ConfirmButton';

const ExpenseOnTask = ({ navigation, route }: ExpenseOnTaskScreenRouteProp) => {
    const { expenseId, taskId } = route.params;
    const {
        data: expenseData,
        isFetching: isFetchingExpense,
        refetch,
        error: queryError,
    } = useGetExpenseById(expenseId);
    const { mutateAsync: deleteTask } = useDeleteExpenseById(expenseId);

    const handleDeleteExpense = async () => {
        await deleteTask({ id: expenseId, taskId });
        navigation.goBack();
    };

    if (expenseData) {
        const expense = expenseData.myAssignedTaskExpenseById;

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
                        <Text className="mb-2 text-gray-800 font-bold">
                            Fuente de pago
                        </Text>
                        <Text className="text-gray-600">{expense.paySource}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Fecha</Text>
                        <Text className="text-gray-600">
                            {format(new Date(expense.createdAt), 'dd/MM/yyyy')}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Estado</Text>
                        <Text className="text-gray-600">{expense.status}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Auditor</Text>
                        <Text className="text-gray-600">
                            {expense.auditor ? expense.auditor.fullName : 'Sin asignar'}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Imagen</Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('FullScreenImage', {
                                    uri: expense.image.url,
                                })
                            }
                            className="mx-auto w-8/12"
                        >
                            <Image
                                className="bg-gray-200 mb-14"
                                source={{ uri: expense.image.url }}
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

export default ExpenseOnTask;
