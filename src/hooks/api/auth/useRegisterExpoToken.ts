import { useMutation } from '@tanstack/react-query';

import { fetchGraphql } from '@/api/fetch-graphql';
import {
    RegisterExpoTokenDocument,
    RegisterExpoTokenMutation,
    RegisterExpoTokenMutationVariables,
} from '@/api/graphql'; // Asumiendo que graphql-codegen generará esto
import { showToast } from '@/lib/toast';

export const useRegisterExpoToken = () => {
    return useMutation<
        RegisterExpoTokenMutation,
        Error,
        RegisterExpoTokenMutationVariables
    >({
        mutationFn: (data) => {
            return fetchGraphql(RegisterExpoTokenDocument, data);
        },
        onError: (error) => {
            console.error('Error registering expo token:', error);
            showToast('Error al registrar el token de notificación', 'error');
        },
        onSuccess: (data) => {
            // La mutación devuelve un booleano directamente en data.registerExpoToken
            if (data.registerExpoToken) {
                showToast('Token de notificación registrado', 'success');
                console.log('Expo token registered successfully');
            } else {
                showToast('No se pudo registrar el token de notificación', 'error');
                console.error('Failed to register expo token, backend returned false.');
            }
        },
    });
};
