import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TASK_BY_ID_QUERY_KEY, TaskByIdQuery } from './useGetMyAssignedTaskById';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    DeleteImageDocument,
    DeleteImageMutation,
    DeleteImageMutationVariables,
} from '@/api/graphql';
import { showToast } from '@/lib/toast';

export const useDeleteImageById = () => {
    const client = useQueryClient();
    return useMutation<DeleteImageMutation, Error, DeleteImageMutationVariables>({
        mutationFn: ({ imageId, taskId }) =>
            fetchGraphql(DeleteImageDocument, { imageId, taskId }),
        onSuccess: (data, { imageId, taskId }) => {
            if (!data) return;

            client.setQueryData<TaskByIdQuery>(
                TASK_BY_ID_QUERY_KEY(taskId),
                (oldData) => {
                    if (!oldData || !oldData.myAssignedTaskById) {
                        return oldData;
                    }
                    const {
                        deleteImage: { task: newTask },
                    } = data;
                    if (!newTask) return oldData;
                    const newData: TaskByIdQuery = {
                        ...oldData,
                        myAssignedTaskById: {
                            ...oldData.myAssignedTaskById,
                            images: oldData.myAssignedTaskById.images.filter(
                                (image) => image.id !== imageId,
                            ),
                        },
                    };
                    return newData;
                },
            );
            showToast('Imagen eliminada', 'success');
        },
        onError: (error) => {
            showToast(`Ocurrió un error: ${error}`, 'error');
        },
    });
};
