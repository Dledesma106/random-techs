import { useQuery } from '@tanstack/react-query';

import { appAxios } from '@/api/axios';
import JWTTokenService from '@/lib/JWTTokenService';
import {
    ExpenseStatus,
    ExpenseType,
    PaySource,
    TaskStatus,
    TaskType,
} from '@/models/types';

export type Expense = {
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
};

export type TaskByIdQueryData = {
    _id: string;
    branch: {
        number: number;
        client: {
            name: string;
        };
    };
    business: {
        name: string;
    };
    images: {
        _id: string;
        url: string;
    }[];
    openedAt: string;
    taskType: TaskType;
    status: TaskStatus;
    description: string;
    closedAt?: Date;
    workOrderNumber: number | undefined;
    expenses: Expense[];
};

type FetchTaskById = {
    data: TaskByIdQueryData;
};

const fetchTaskById = (id: string) => async () => {
    const response = await appAxios.get<FetchTaskById>(`/tech/tasks/${id}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (await JWTTokenService.getAsync()) || '',
        },
    });

    return response.data.data;
};

export const TASK_BY_ID_QUERY_KEY = (id: string) => ['tasks', 'detail', id];

export const useTaskByIdQuery = (id: string) => {
    return useQuery<FetchTaskById['data']>({
        queryKey: ['tasks', 'detail', id],
        queryFn: fetchTaskById(id),
    });
};
