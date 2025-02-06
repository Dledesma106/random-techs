import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

import { ExpensePaySource, ExpensePaySourceBank, ExpenseType } from '@/api/graphql';
import ConfirmButton from '@/components/ConfirmButton';
import { showToast } from '@/lib/toast';
import { getFileSignedUrl, getS3SignedUrl, stringifyObject } from '@/lib/utils';

interface ExpenseDetail {
    amount: number | string;
    expenseType: ExpenseType;
    paySource: ExpensePaySource;
    paySourceBank: ExpensePaySourceBank | null;
    doneBy: string;
    createdAt?: Date;
    observations: string | null;
    image?: { url: string } | null;
    imageKey?: string | null;
    installments: number | null;
    expenseDate: Date;
    cityName: string | null;
    expenseNumber?: string;
    file?: { url: string; mimeType: string } | null;
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
    const [fileUrl, setFileUrl] = useState<string>(expense.file?.url ?? '');

    useEffect(() => {
        const getImageOrFileUrl = async () => {
            if (expense.image) {
                setImageUrl(
                    expense.image.url ?? (await getS3SignedUrl(expense.imageKey ?? '')),
                );
            }
            if (expense.file) {
                const { url } = await getFileSignedUrl(
                    expense.file.url,
                    expense.file.mimeType,
                );
                setFileUrl(url);
            }
            setIsLoading(false);
        };

        getImageOrFileUrl();
    }, [expense]);

    if (isLoading)
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Cargando...</Text>
            </View>
        );

    return (
        <ScrollView className="bg-white h-screen">
            {process.env.NODE_ENV === 'development' && (
                <>
                    <Text>detalle {stringifyObject(expense)}</Text>
                </>
            )}
            <View className="px-4 pt-4 pb-20">
                {expense.expenseNumber && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">ID de gasto</Text>

                        <Text className="text-gray-600">#{expense.expenseNumber}</Text>
                    </View>
                )}
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

                {expense.paySource === 'Credito' && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Cuotas</Text>
                        <Text className="text-gray-600">{expense.installments}</Text>
                    </View>
                )}

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

                {expense.cityName && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Ciudad</Text>
                        <Text className="text-gray-600">{expense.cityName}</Text>
                    </View>
                )}

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">
                        Fecha de Registrado
                    </Text>
                    <Text className="text-gray-600">
                        {format(
                            expense.createdAt ? new Date(expense.createdAt) : new Date(),
                            'dd/MM/yyyy',
                        )}
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Fecha de Compra</Text>
                    <Text className="text-gray-600">
                        {format(
                            expense.expenseDate
                                ? new Date(expense.expenseDate)
                                : new Date(),
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

                {expense.image && (
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
                )}

                {expense.file && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Archivo adjunto
                        </Text>
                        <TouchableOpacity
                            onPress={async () => {
                                const supported = await Linking.canOpenURL(fileUrl);

                                if (supported) {
                                    await Linking.openURL(fileUrl);
                                } else {
                                    showToast('No se puede abrir el archivo', 'error');
                                }
                            }}
                        >
                            <Text className="text-blue-500 underline">Abrir archivo</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
