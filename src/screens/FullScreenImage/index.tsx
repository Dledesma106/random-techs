import { TouchableOpacity, View } from 'react-native';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { FullScreenImageProp } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AntDesign } from '@expo/vector-icons';

const FullScreenImage = ({ navigation, route }: FullScreenImageProp) => {
    const { uri } = route.params;
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 relative">
                <Zoomable>
                    <Image className="flex-1" source={{ uri }} />
                </Zoomable>
                <View className="absolute top-2 right-2 bg-black flex items-center justify-center rounded-full z-50 w-8 h-8 opacity-0.5">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default FullScreenImage;
