import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Linking, TouchableOpacity, Text, View } from 'react-native';

import { showToast } from '@/lib/toast';

interface FileViewerProps {
    url: string;
    name?: string;
    size?: number;
    isUploading?: boolean;
    onDelete?: () => void;
    className?: string;
}

const FileViewer = ({
    url,
    name = 'Archivo adjunto',
    size,
    isUploading,
    onDelete,
    className = 'px-4 pt-4',
}: FileViewerProps) => {
    const handlePress = async () => {
        try {
            if (url.startsWith('file://')) {
                // Para archivos locales
                await FileSystem.getContentUriAsync(url).then((contentUri) => {
                    return Linking.openURL(contentUri);
                });
            } else {
                // Para URLs remotas
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    showToast('No se puede abrir el archivo', 'error');
                }
            }
        } catch (error) {
            showToast('Error al abrir el archivo', 'error');
        }
    };

    return (
        <View className={`${className} w-full`}>
            <View className="flex-1 relative p-4 border border-gray-200 rounded-lg">
                {isUploading ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-black font-bold">Subiendo...</Text>
                    </View>
                ) : (
                    <>
                        <View className="pr-8">
                            <Text
                                className="font-bold"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {name}
                            </Text>
                            {size && (
                                <Text className="text-sm text-gray-500">
                                    {(size / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            )}

                            <TouchableOpacity onPress={handlePress}>
                                <Text className="text-blue-500 underline mt-2">
                                    Ver archivo
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {onDelete && (
                            <TouchableOpacity
                                onPress={onDelete}
                                className="flex flex-row items-center justify-center absolute rounded-full w-4 h-4 bg-black top-2 right-2"
                            >
                                <AntDesign name="close" size={10} color="white" />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

export default FileViewer;
