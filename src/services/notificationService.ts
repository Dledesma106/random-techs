import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

import { showToast } from '@/lib/toast';
import { navigate } from '@/navigation/RootNavigation'; // Ajusta la ruta si es necesario

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Necesitamos una forma de llamar al hook useRegisterExpoToken fuera de un componente de React.
// Una opción es pasar la función mutateAsync como parámetro si esta función
// se llama desde un contexto donde el hook ya está inicializado.
// Por ahora, para simplificar, asumiremos que podemos obtener la función de alguna manera
// o que la lógica de registro se moverá a un hook personalizado que maneje notificaciones.

// Esta es una función de ayuda que necesitaría acceso a `mutateAsync` del hook.
async function callRegisterTokenMutation(
    token: string,
    registerTokenFunc: (variables: { token: string }) => Promise<any>,
) {
    try {
        await registerTokenFunc({ token });
        console.log('Token registered with backend via hook');
    } catch (error) {
        console.error('Error registering token with backend via hook:', error);
    }
}

async function registerForPushNotificationsAsync(
    // Esta es una forma de pasar la función de mutación si se obtiene de un hook en el contexto de llamada
    registerTokenMutationFn?: (variables: { token: string }) => Promise<any>,
) {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted!');
        return null;
    }

    try {
        const projectId = Constants.expoConfig?.extra?.['eas']?.projectId;
        if (!projectId) {
            console.error('Project ID not found in app config. Cannot get push token.');
            Alert.alert(
                'Error',
                'No se pudo obtener el token de notificación por falta de projectId',
            );
            showToast(
                'No se pudo obtener el token de notificación por falta de projectId',
                'error',
            );
            return null;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);
    } catch (e) {
        console.error('Failed to get push token', e);
        showToast('No se pudo obtener el token de notificación: ' + e, 'error');
        return null;
    }

    if (token && registerTokenMutationFn) {
        await callRegisterTokenMutation(token, registerTokenMutationFn);
    }
    return token;
}

export { registerForPushNotificationsAsync };

// --- Manejo de Notificaciones Entrantes (a implementar) ---

// Listener para notificaciones recibidas mientras la app está en primer plano
Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received while app is foregrounded:', notification);
    // Aquí puedes agregar lógica adicional si es necesario,
    // por ejemplo, actualizar el estado de la UI, mostrar un toast personalizado, etc.
    // Por defecto, el `setNotificationHandler` ya se encarga de mostrar la alerta.
});

// Listener para la respuesta del usuario a una notificación (ej. tocarla)
Notifications.addNotificationResponseReceivedListener((response) => {
    const notificationData = response.notification.request.content.data;

    if (notificationData && notificationData.taskId) {
        navigate('AssignedTask', { id: notificationData.taskId as string });
    }
});
