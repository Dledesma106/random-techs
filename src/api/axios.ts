import axios from 'axios';

import JWTTokenService from '@/lib/JWTTokenService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_HOST ?? 'https://ransys-test.vercel.app';

export const createAppAxiosAsync = async () => {
    const token = await JWTTokenService.getAsync();

    return axios.create({
        baseURL: `${API_BASE_URL}/api`,
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const apiAsync = createAppAxiosAsync();

export default apiAsync;
