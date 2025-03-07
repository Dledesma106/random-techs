import {
    Camera,
    CameraView,
    CameraCapturedPicture,
    CameraType,
    PermissionStatus,
} from 'expo-camera';
import { useState, useRef } from 'react';

type UseCameraOptions = {
    defaultType?: CameraType;
    isSwitchable?: boolean;
    showByDefault?: boolean;
};

export type UseCameraResult = {
    hasPermission: boolean | null;
    type: string;
    cameraRef: React.RefObject<CameraView>;
    switchCamera: () => void;
    takePictureAsync: () => Promise<CameraCapturedPicture | null>;
    askForPermissions: () => Promise<PermissionStatus>;
    active: boolean;
    activate: () => void;
    deactivate: () => void;
};

const useCamera = (options: UseCameraOptions = {}): UseCameraResult => {
    const { defaultType = 'back', isSwitchable = false, showByDefault = false } = options;

    const cameraRef = useRef<CameraView>(null);

    const [type, setType] = useState(defaultType);
    const [showCamera, setShowCamera] = useState(showByDefault);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const askForPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === PermissionStatus.GRANTED);
        return status;
    };

    const switchCamera = () => {
        if (!isSwitchable) return;

        if (type === 'back') {
            setType('front');
        } else {
            setType('back');
        }
    };

    const takePictureAsync = async () => {
        const camera = cameraRef.current;
        if (!camera) return null;

        const picture = await camera.takePictureAsync();
        return picture ?? null;
    };

    return {
        hasPermission,
        type,
        cameraRef,
        switchCamera,
        takePictureAsync,
        askForPermissions,
        active: showCamera,
        activate: () => setShowCamera(true),
        deactivate: () => setShowCamera(false),
    };
};

export default useCamera;
