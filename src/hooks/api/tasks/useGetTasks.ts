import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ITask } from '@/models/interfaces';
import apiAsync from '@/api/axios';

const getTasks = async (): Promise<ITask[]> => {
    const api = await apiAsync;
    const response = await api.get<ITask[]>(`/tech/tasks`);
    console.log(response);
    return response.data;
};

const useGetTasks = (): UseQueryResult<ITask[], Error> => {
    return useQuery<ITask[], Error>({
        queryKey: ['Task'],
        queryFn: () => getTasks(),
    });
};

export default useGetTasks;
