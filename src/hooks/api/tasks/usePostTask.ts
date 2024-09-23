import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import apiAsync from '@/api/axios';
import { ITask } from '@/models/interfaces';

interface PostTaskResponse {
    success: boolean;
    message: string;
}

const postTask = async (task: ITask): Promise<PostTaskResponse> => {
    const api = await apiAsync;
    const response: AxiosResponse<PostTaskResponse> = await api.post('/tech/tasks', task);
    return response.data;
};

const usePostTask = (): UseMutationResult<PostTaskResponse, Error, ITask> => {
    return useMutation<PostTaskResponse, Error, ITask>({
        mutationFn: (data) => postTask(data),
    });
};

export default usePostTask;
