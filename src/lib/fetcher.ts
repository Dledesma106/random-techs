import Token from './JWTTokenService';
import { isReachable } from './utils';

const contentType = 'application/json';

async function getRequestInnit(method: string, data: any): Promise<RequestInit> {
    const auth = await Token.get('access_token');
    const requestInit: RequestInit =
        method === 'GET'
            ? {
                  method,
                  mode: 'no-cors',
                  headers: {
                      Accept: contentType,
                      'Content-Type': contentType,
                      Authorization: auth ?? '',
                  },
              }
            : {
                  method,
                  mode: 'no-cors',
                  headers: {
                      Accept: contentType,
                      'Content-Type': contentType,
                      Authorization: auth ?? '',
                  },
                  body: JSON.stringify({ ...data, appRequest: true }),
              };
    return requestInit;
}

async function fetchOut(url: string, data: any, method: string): Promise<any> {
    if (!(await isReachable(url))) throw new Error('Server offline');
    const requestInit = await getRequestInnit(method, data);
    const res: Response = await fetch(url, requestInit);

    if (!res.ok) {
        throw new Error('failed fetch');
    }
    const json /* :Promise<LoginResponseJson>  */ = await res.json();
    return json.data;
}

const fetcher = {
    get: async function (url: string) {
        return await fetchOut(url, {}, 'GET');
    },
    post: async function (url: string, data: any) {
        return await fetchOut(url, data, 'POST');
    },
    put: async function (url: string, data: any) {
        return await fetchOut(url, data, 'PUT');
    },
    delete: async function (url: string, data: any) {
        return await fetchOut(url, data, 'DELETE');
    },
};

export default fetcher;
