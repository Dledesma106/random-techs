import { EvilIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = { navigateToCameraScreen: () => void; selectImage: () => void };

const AddImage = ({ navigateToCameraScreen, selectImage }: Props) => {
    return (
        <View className="flex-[0.33] relative border border-border">
            <View
                className="bg-muted flex items-center justify-around"
                style={{
                    aspectRatio: 9 / 16,
                }}
            >
                <TouchableOpacity
                    onPress={navigateToCameraScreen}
                    className="items-center"
                >
                    <EvilIcons name="camera" size={32} color="#4B5563" />

                    <Text className="text-[#4B5563] text-xs">Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={selectImage} className="items-center">
                    <EvilIcons name="image" size={32} color="#4B5563" />

                    <Text className="text-[#4B5563] text-xs">Elegir foto</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddImage;
