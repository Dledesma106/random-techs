import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

import CollapsableText from './CollapsableText';

import { TaskStatus } from '@/api/graphql';
import { MyExpenseByIdQuery, ExpenseInput } from '@/api/graphql';
import ConfirmButton from '@/components/ConfirmButton';
import FileViewer from '@/components/FileViewer';
import { getFileSignedUrl, getS3SignedUrl, stringifyObject } from '@/lib/utils';

const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';

// Unión de tipos para soportar tanto Expense como ExpenseInput
export type ExpenseDetailType =
    | (MyExpenseByIdQuery['myExpenseById'] &
          Partial<
              Pick<
                  ExpenseInput,
                  'imageKeys' | 'fileKeys' | 'filenames' | 'mimeTypes' | 'sizes'
              >
          >)
    | (ExpenseInput & {
          images?: { url: string }[] | null;
          files?: { url: string; filename?: string; size?: number }[] | null;
          createdAt?: string;
          task?: { status: TaskStatus };
      });

interface ExpenseDetailProps {
    onDelete: () => void;
    expense: ExpenseDetailType;
    canDelete?: boolean;
}

const ExpenseDetail = ({ onDelete, expense, canDelete = true }: ExpenseDetailProps) => {
    const navigation = useNavigation();
    const handleDeleteExpense = async () => {
        onDelete();
    };
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [fileUrls, setFileUrls] = useState<
        { url: string; filename: string; size: number }[]
    >([]);

    useEffect(() => {
        const getImagesAndFilesUrls = async () => {
            const images: string[] = [];
            const files: { url: string; filename: string; size: number }[] = [];

            // Procesar todas las imágenes disponibles
            // Primero las imágenes ya con URL
            if ('images' in expense && expense.images && expense.images.length > 0) {
                for (const img of expense.images) {
                    if (img.url) images.push(img.url);
                }
            }

            // Finalmente las claves de imágenes múltiples
            if (expense.imageKeys && expense.imageKeys.length > 0) {
                for (const key of expense.imageKeys) {
                    if (key) {
                        const url = await getS3SignedUrl(key);
                        images.push(url);
                    }
                }
            }

            // Procesar archivos
            if ('files' in expense && expense.files && expense.files.length > 0) {
                for (const file of expense.files) {
                    if (file.url) {
                        files.push({
                            url: file.url,
                            filename: file.filename || 'archivo.pdf',
                            size: file.size || 0,
                        });
                    }
                }
            }

            // Procesar claves de archivos múltiples
            if (expense.fileKeys && expense.fileKeys.length > 0) {
                for (let i = 0; i < expense.fileKeys.length; i++) {
                    const key = expense.fileKeys[i];
                    if (key) {
                        const mimeType = expense.mimeTypes?.[i] || 'application/pdf';
                        const result = await getFileSignedUrl(key, mimeType);
                        files.push({
                            url: result.url,
                            filename: expense.filenames?.[i] || `archivo_${i + 1}.pdf`,
                            size: expense.sizes?.[i] || 0,
                        });
                    }
                }
            }

            setImageUrls(images);
            setFileUrls(files);
            setIsLoading(false);
        };

        getImagesAndFilesUrls();
    }, [expense]);

    if (isLoading || !expense)
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Cargando...</Text>
            </View>
        );

    return (
        <ScrollView className="bg-white h-screen">
            {isDevelopment && (
                <CollapsableText
                    buttonText="datos de desarrollo"
                    text={stringifyObject(expense ?? {})}
                />
            )}
            <View className="px-4 pt-4 pb-20">
                {'expenseNumber' in expense && expense.expenseNumber && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">ID de gasto</Text>
                        <Text className="text-gray-600">#{expense.expenseNumber}</Text>
                    </View>
                )}
                <View className="mb-4">
                    <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                    <Text className="text-gray-600">
                        ${expense?.amount?.toLocaleString('es-AR')}
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

                {imageUrls.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">Imágenes</Text>
                        <View className="flex-row flex-wrap">
                            {imageUrls.map((url, index) => (
                                <TouchableOpacity
                                    key={`image-${index}`}
                                    onPress={() =>
                                        navigation.navigate('FullScreenImage', {
                                            uri: url,
                                        })
                                    }
                                    className="mx-1 mb-2 w-[45%]"
                                >
                                    <Image
                                        className="bg-gray-200"
                                        source={{ uri: url }}
                                        style={{
                                            borderRadius: 6,
                                            aspectRatio: 9 / 16,
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {fileUrls.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Archivos adjuntos
                        </Text>
                        <View className="space-y-2">
                            {fileUrls.map((file, index) => (
                                <FileViewer
                                    key={`file-${index}`}
                                    url={file.url}
                                    name={file.filename}
                                    size={file.size}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </View>
            {canDelete && (
                <ConfirmButton
                    title="Eliminar Gasto"
                    confirmMessage="¿Seguro que quiere eliminar el gasto?"
                    onConfirm={handleDeleteExpense}
                    icon={<EvilIcons name="trash" size={22} color="white" />}
                />
            )}
        </ScrollView>
    );
};

export default ExpenseDetail;
