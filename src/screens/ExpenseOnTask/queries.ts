import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import { ExpenseStatus, ExpenseType, PaySource } from '@/models/types';

export type ExpenseByIdQueryData = {
    _id: string;
    expenseType: ExpenseType;
    paySource: PaySource;
    status: ExpenseStatus;
    image: {
        url: string;
    };
    amount: number;
    auditor?: {
        name: string;
    };
    createdAt: string;
};

type FetchExpenseById = {
    data: ExpenseByIdQueryData;
};

const fetchExpenseById = (id: string) => async () => {
    const response = await appAxios.get<FetchExpenseById>(`/tech/expenses/${id}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.get()) || '',
        },
    });
    return response.data.data;
};

export const useExpenseByIdQuery = (id: string) => {
    return useQuery<FetchExpenseById['data']>({
        queryKey: ['expenses', 'detail', id],
        queryFn: fetchExpenseById(id),
    });
};
