import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? 'https://ransys-test.vercel.app';

export const appAxios = axios.create({
    baseURL: `${API_BASE_URL}/api`,

    withCredentials: true,
});
