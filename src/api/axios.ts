import axios from 'axios';

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://ransys-test.vercel.app';

export const appAxios = axios.create({
    baseURL: `${API_BASE_URL}/api`,

    withCredentials: true,
});
