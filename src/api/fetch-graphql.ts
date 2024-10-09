import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import Constants from 'expo-constants';
import { print } from 'graphql/language/printer';

import JWTTokenService from '@/lib/JWTTokenService';

export { gql } from 'graphql-request';

const url = `${Constants.expoConfig?.extra?.['apiHost']}/api/graphql`;

export async function fetchGraphql<T, V>(
    query: TypedDocumentNode<T, V>,
    variables: V,
    {
        ...options
    }: Omit<RequestInit, 'method' | 'headers' | 'body'> & {
        token?: string;
    } = {},
) {
    const token = await JWTTokenService.getAsync();
    console.log(variables);
    console.log(print(query));
    try {
        const fetchConfig: RequestInit = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Mobile-App': 'true',
                ...(token
                    ? {
                          Authorization: `Bearer ${token}`,
                      }
                    : {}),
            },
            body: JSON.stringify({
                query: print(query),
                variables: variables ?? undefined,
            }),
            ...options,
        };
        const response = await fetch(url, fetchConfig);

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();

        if (json.errors && json.errors.length > 0) {
            const firstError = json.errors[0];
            let message = firstError.message;
            const firstErrorSplitted = firstError.message.split('Error: ');
            if (firstErrorSplitted.length > 1) {
                message = firstErrorSplitted.slice(1).join('');
                console.log('error message: ', message);
            }

            if (message === 'Error decoding signature') {
                sessionStorage.removeItem('token');
                return fetchGraphql<T, V>(query, variables);
            } else {
                throw new Error(message);
            }
        }

        const data = json.data;
        if (!data) {
            throw new Error('No data');
        }

        return data as T;
    } catch (error) {
        if (error instanceof Response) {
            if (error.status === 409) {
                window.location.href = '/request-email-verification';
            }

            throw error;
        }

        throw error;
    }
}
