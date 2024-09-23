import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ITask } from '@/models/interfaces';
import apiAsync from '@/api/axios';

const getTaskById = async (id: string): Promise<ITask> => {
    const api = await apiAsync;
    const response = await api.get<ITask>(`/tech/tasks/${id}`);
    console.log(response.data);
    return response.data;
};

const useGetTaskById = (id: string): UseQueryResult<ITask, Error> => {
    return useQuery<ITask, Error>({
        queryKey: ['Task', id],
        queryFn: () => getTaskById(id),
    });
};

export default useGetTaskById;
