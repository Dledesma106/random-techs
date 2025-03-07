import { useEffect, useRef } from 'react';

export function useDebouncer<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
) {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const isMountedRef = useRef(true);
    const callbackRef = useRef(callback);

    // Actualizar la referencia del callback cuando cambie
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Manejar el montaje/desmontaje
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            isMountedRef.current = false;
        };
    }, []);

    return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const promise = new Promise((resolve, reject) => {
            timeoutRef.current = setTimeout(async () => {
                try {
                    if (isMountedRef.current) {
                        const result = await callbackRef.current(...args);
                        resolve(result);
                    }
                } catch (error) {
                    console.error('Error in debounced function:', error);
                    reject(error);
                }
            }, delay);
        });

        // Agregar método cancel a la promesa
        (promise as any).cancel = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        return promise;
    };
}
