import bcryptjs from 'bcryptjs';
import isaac from 'isaac';

export function useBcryptConfig() {
    return () => {
        bcryptjs.setRandomFallback((len) => {
            const buf = new Array(len);

            return buf.map(() => Math.floor(isaac.random() * 256));
        });
    };
}
