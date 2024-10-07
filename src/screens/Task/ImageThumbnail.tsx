import { View, Text, Image, ActivityIndicator } from 'react-native';

interface ImageInput {
    __typename?: 'Image';
    id?: string;
    url?: string;
    uri?: string;
    key?: string;
    unsaved?: boolean;
}

type Props = { image: ImageInput };

const ImageThumbnail = ({ image }: Props) => {
    return (
        <View className="flex-[0.33] relative">
            <Image
                className="bg-gray-200 relative z-0"
                source={{ uri: image.url ?? image.uri }}
                style={{
                    borderRadius: 6,
                    aspectRatio: 9 / 16,
                }}
            />

            {image.unsaved && (
                <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-white/70">
                    <ActivityIndicator className="mb-1" size="small" color="black" />

                    <Text className="text-xs text-black">Subiendo...</Text>
                </View>
            )}

            {/* {task.status === TaskStatus.Pendiente &&
                image.unsaved && (
                    <View className="absolute top-2 right-2 bg-black flex items-center justify-center rounded-full z-50 w-6 h-6">
                        <TouchableOpacity
                            onPress={() => {
                                taskUpdateMutation.mutate({
                                    id: task.id,
                                    imageIdToDelete: image.id,
                                    status: null,
                                    workOrderNumber: null,
                                });
                            }}
                        >
                            <AntDesign
                                name="close"
                                size={14}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                )} */}
        </View>
    );
};

export default ImageThumbnail;
