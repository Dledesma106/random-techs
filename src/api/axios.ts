import axios from 'axios';

import JWTTokenService from '@/lib/JWTTokenService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_HOST ?? 'https://ransys-test.vercel.app';

export const appAxios = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTTokenService.getAsync()}`,
    },
});
