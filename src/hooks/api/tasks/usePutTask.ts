import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import apiAsync from '@/api/axios';
import { ITask } from '@/models/interfaces';

interface PutTaskResponse {
    success: boolean;
    message: string;
}

const putTask = async (task: ITask): Promise<PutTaskResponse> => {
    const api = await apiAsync;
    const response: AxiosResponse<PutTaskResponse> = await api.put('/tech/tasks', task);
    return response.data;
};

const uuPostTask = (): UseMutationResult<PutTaskResponse, Error, ITask> => {
    return useMutation<PutTaskResponse, Error, ITask>({
        mutationFn: (data) => putTask(data),
    });
};

export default uuPostTask;
