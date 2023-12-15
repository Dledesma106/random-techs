import { Camera, CameraCapturedPicture, CameraType, PermissionStatus } from 'expo-camera';
import { useState, useRef } from 'react';

type UseCameraOptions = {
    defaultType?: CameraType;
    isSwitchable?: boolean;
    showByDefault?: boolean;
};

export type UseCameraResult = {
    hasPermission: boolean | null;
    type: CameraType;
    cameraRef: React.RefObject<Camera>;
    switchCamera: () => void;
    takePictureAsync: () => Promise<CameraCapturedPicture | null>;
    askForPermissions: () => Promise<PermissionStatus>;
    active: boolean;
    activate: () => void;
    deactivate: () => void;
};

const useCamera = (options: UseCameraOptions = {}): UseCameraResult => {
    const {
        defaultType = CameraType.back,
        isSwitchable = false,
        showByDefault = false,
    } = options;

    const cameraRef = useRef<Camera>(null);

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

        if (type === CameraType.back) {
            setType(CameraType.front);
        } else {
            setType(CameraType.back);
        }
    };

    const takePictureAsync = async () => {
        const camera = cameraRef.current;
        if (!camera) return null;

        const picture = await camera.takePictureAsync();
        return picture;
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
