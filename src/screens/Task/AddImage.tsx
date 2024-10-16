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
        <View
            className={`flex-[0.20] bg-muted items-center justify-around border border-border`}
            style={{
                borderRadius: 6,
                aspectRatio: 9 / 16,
            }}
        >
            <TouchableOpacity onPress={navigateToCameraScreen} className="items-center">
                <EvilIcons name="camera" size={32} color="#4B5563" />

                <Text className="text-[#4B5563] text-xs">Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImage} className="items-center">
                <EvilIcons name="image" size={32} color="#4B5563" />

                <Text className="text-[#4B5563] text-xs">Elegir foto</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddImage;
