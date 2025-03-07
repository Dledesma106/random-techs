import Toast from 'react-native-root-toast';

type ToastType = 'success' | 'error';

const TOAST_STYLES = {
    success: {
        backgroundColor: '#22c55e',
        textColor: '#ffffff',
    },
    error: {
        backgroundColor: '#ef4444',
        textColor: '#ffffff',
    },
};

export const showToast = (message: string, type: ToastType = 'success') => {
    Toast.show(message, {
        duration: type === 'success' ? Toast.durations.SHORT : Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        opacity: 0.9,
        ...TOAST_STYLES[type],
    });
};
