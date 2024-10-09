import { EvilIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
    navigateToCameraScreen: () => void;
    selectImage: () => void;
    maxImageAmount: number;
};

const AddImage = ({ navigateToCameraScreen, selectImage, maxImageAmount }: Props) => {
    const flexPercent = Math.trunc(100 / maxImageAmount);
    return (
        <View className={`flex-[0.${String(flexPercent)}] relative border border-border`}>
            <View
                className="bg-muted flex items-center justify-around"
                style={{
                    borderRadius: 6,
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
