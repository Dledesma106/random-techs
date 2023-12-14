declare global {
    interface FormDataValue {
        uri: string;
        name: string;
        type: string;
    }

    interface FormData {
        append(name: string, value: FormDataValue, fileName?: string): void;
        set(name: string, value: FormDataValue, fileName?: string): void;
    }
}

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError;
    }
}

export {};
