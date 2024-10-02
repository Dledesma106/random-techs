import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const useImagePicker = () => {
    const [uri, setUri] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUri(result.assets[0].uri);
            return result.assets[0].uri;
        }
    };

    return { uri, pickImage };
};

export default useImagePicker;