import { RootStackParamList } from '@/navigation/types';
import { AntDesign } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

export interface ThumbnailImage {
    __typename?: 'Image';
    id?: string;
    url?: string;
    uri?: string;
    key?: string;
    unsaved?: boolean;
}

type Props = {
    image: ThumbnailImage;
    onImagePress: () => void;
};

const ImageThumbnail = ({ image, onImagePress }: Props) => {
    //const flexPercent = Math.trunc(100 / maxImageAmount);
    return (
        <View className={`flex-[0.20] relative m-1`}>
            <TouchableOpacity onPress={onImagePress}>
                <Image
                    className="bg-gray-200 relative z-0"
                    source={{ uri: image.url ?? image.uri }}
                    style={{
                        borderRadius: 6,
                        aspectRatio: 9 / 16,
                    }}
                />
            </TouchableOpacity>

            {image.unsaved && (
                <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-white/70">
                    <ActivityIndicator className="mb-1" size="small" color="black" />
                    <Text className="text-xs text-black">Subiendo...</Text>
                </View>
            )}
        </View>
    );
};

export default ImageThumbnail;
