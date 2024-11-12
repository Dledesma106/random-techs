import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

import { ExpensePaySource, ExpensePaySourceBank, ExpenseType } from '@/api/graphql';
import ConfirmButton from '@/components/ConfirmButton';
import { getS3SignedUrl, stringifyObject } from '@/lib/utils';

interface ExpenseDetail {
    amount: number | string;
    expenseType: ExpenseType;
    paySource: ExpensePaySource;
    paySourceBank: ExpensePaySourceBank | null;
    doneBy: string;
    createdAt?: Date;
    observations: string | null;
    image?: { url: string };
    imageKey?: string;
}

interface ExpenseDetailProps {
    onDelete: () => void;
    expense: ExpenseDetail;
}

const ExpenseDetail = ({ onDelete, expense }: ExpenseDetailProps) => {
    const navigation = useNavigation();
    const handleDeleteExpense = async () => {
        onDelete();
    };
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState<string>(expense.image?.url ?? '');

    useEffect(() => {
        const getImageUrl = async () => {
            setImageUrl(
                expense.image?.url ?? (await getS3SignedUrl(expense.imageKey ?? '')),
            );
            setIsLoading(false);
        };

        getImageUrl();
    }, [expense]);

    if (isLoading) return <Text>Cargando...</Text>;

    return (
        <ScrollView className="bg-white h-screen">
            {process.env.NODE_ENV === 'development' && (
                <>
                    <Text>detalle {stringifyObject(expense)}</Text>
                </>
            )}
            <View className="px-4 py-4">
                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                    <Text className="text-gray-600">
                        ${expense.amount.toLocaleString('es-AR')}
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Tipo</Text>
                    <Text className="text-gray-600">{expense.expenseType}</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Fuente de pago</Text>
                    <Text className="text-gray-600">{expense.paySource}</Text>
                </View>

                {['Credito', 'Debito'].includes(expense.paySource) && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Banco emisor</Text>
                        <Text className="text-gray-600">{expense.paySourceBank}</Text>
                    </View>
                )}

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Pagado por</Text>
                    <Text className="text-gray-600">{expense.doneBy}</Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Fecha</Text>
                    <Text className="text-gray-600">
                        {format(
                            expense.createdAt ? new Date(expense.createdAt) : new Date(),
                            'dd/MM/yyyy',
                        )}
                    </Text>
                </View>

                {expense.observations && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Observaciones
                        </Text>
                        <Text className="text-gray-600">{expense.observations}</Text>
                    </View>
                )}

                {/* <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Estado</Text>
                        <Text className="text-gray-600">{expense.status}</Text>
                    </View> */}

                {/* <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Auditor</Text>
                        <Text className="text-gray-600">
                            {expense.auditor ? expense.auditor.fullName : 'Sin asignar'}
                        </Text>
                    </View> */}

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Imagen</Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('FullScreenImage', {
                                uri: imageUrl ?? '',
                            })
                        }
                        className="mx-auto w-8/12"
                    >
                        <Image
                            className="bg-gray-200 mb-14"
                            source={{ uri: imageUrl }}
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

export default ExpenseDetail;
