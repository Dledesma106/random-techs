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
            isMountedRef.current = false;
        };
    }, []);

    return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                await callbackRef.current(...args);
            } catch (error) {
                console.error('Error in debounced function:', error);
            }
        }, delay);
    };
}
