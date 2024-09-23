import { EvilIcons } from '@expo/vector-icons';
import { CameraView, BarcodeType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    Text,
    DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useCamera from '@/hooks/useCamera';
import { FullScreenCameraProps } from '@/navigation/types';
import { uploadPhoto } from '@/lib/utils';

const EVENT_NAME = 'fullscreen-camera-photo-taken-event';

export const addFullScreenCameraListener = (callback: (uri: string) => void) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeFullScreenCameraListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitFullScreenCameraEvent = (uri: string) => {
    DeviceEventEmitter.emit(EVENT_NAME, uri);
};

const FullScreenCameraScreen = ({ navigation }: FullScreenCameraProps) => {
    const useCameraResult = useCamera();
    const [photoURI, setPhotoURI] = useState<string | null>(null);

    useEffect(() => {
        MediaLibrary.requestPermissionsAsync();
        useCameraResult.askForPermissions();
    }, []);

    useEffect(() => {
        return () => {
            removeFullScreenCameraListener();
        };
    }, []);

    const takePhoto = async () => {
        if (!useCameraResult.cameraRef) return;

        const picture = await useCameraResult.takePictureAsync();
        if (!picture) return;

        setPhotoURI(picture.uri);
    };

    const onPhotoTaken = async (uri: string) => {
        emitFullScreenCameraEvent(uri);
        navigation.goBack();
    };

    if (photoURI) {
        return (
            <SafeAreaView className="flex-1">
                <View className="flex-1">
                    <ImageBackground className="flex-1" source={{ uri: photoURI }} />
                </View>

                <View className="px-4 py-4 bg-black flex flex-row justify-between">
                    <TouchableOpacity
                        onPress={() => {
                            setPhotoURI(null);
                        }}
                        className="bg-white rounded-full p-2 px-4 font-bold"
                    >
                        <Text style={{ fontWeight: 'bold' }}>Volver a tomar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onPhotoTaken(photoURI);
                        }}
                        className="bg-white rounded-full p-2 px-4 font-bold"
                    >
                        <Text style={{ fontWeight: 'bold' }}>Usar foto</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <CameraView
                className="flex-1 w-full"
                ref={useCameraResult.cameraRef}
                ratio="16:9"
            >
                <View className="flex-1">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="bg-black flex rounded-full absolute top-4 left-4 h-8 w-8"
                    >
                        <EvilIcons
                            name="close"
                            style={{
                                alignSelf: 'center',
                                lineHeight: 32,
                            }}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>

                    <View className="absolute w-full flex items-center p-5 bottom-0 inset-x-0">
                        <TouchableOpacity
                            onPress={takePhoto}
                            className="w-16 h-16 rounded-full border-2 border-white bg-white/30"
                        />
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    );
};

export default FullScreenCameraScreen;
