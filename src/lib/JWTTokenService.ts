import * as SecureStore from 'expo-secure-store';

const KEY = 'jwtToken';

const JWTTokenService = {
    save: async (value: string) => {
        await SecureStore.setItemAsync(KEY, value);
    },
    get: async () => {
        const result = await SecureStore.getItemAsync(KEY);
        if (result) {
            return result;
        } else {
            return null;
        }
    },
};

export default JWTTokenService;
