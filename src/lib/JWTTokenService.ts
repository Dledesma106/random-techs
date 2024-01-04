import * as SecureStore from 'expo-secure-store';

const KEY = 'jwtToken';

const JWTTokenService = {
    saveAsync: async (value: string) => {
        console.log('JWTTokenService.save', value);
        await SecureStore.setItemAsync(KEY, value);
    },
    getAsync: async () => {
        const result = await SecureStore.getItemAsync(KEY);
        if (result) {
            return result;
        } else {
            return null;
        }
    },
    deleteAsync: async () => {
        await SecureStore.deleteItemAsync(KEY);
    },
};

export default JWTTokenService;
