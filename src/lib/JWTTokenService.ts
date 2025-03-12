import * as SecureStore from 'expo-secure-store';

const KEY = 'jwtToken';

const JWTTokenService = {
    saveAsync: async (value: string) => {
        console.log('JWTTokenService.save', value);
        try {
            await SecureStore.setItemAsync(KEY, value);
        } catch (error) {
            console.error('Error al guardar el token JWT:', error);
        }
    },
    getAsync: async () => {
        try {
            const result = await SecureStore.getItemAsync(KEY);
            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Error al obtener el token JWT:', error);
            // Si hay un error al desencriptar, eliminamos el token
            try {
                await SecureStore.deleteItemAsync(KEY);
            } catch (deleteError) {
                console.error('Error al eliminar el token JWT corrupto:', deleteError);
            }
        }
        return null;
    },
    deleteAsync: async () => {
        try {
            await SecureStore.deleteItemAsync(KEY);
        } catch (error) {
            console.error('Error al eliminar el token JWT:', error);
        }
    },
};

export default JWTTokenService;
