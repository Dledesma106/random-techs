import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { IUser } from '../models/interfaces';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatIds = <T>(doc: T): T => {
    return JSON.parse(JSON.stringify(doc));
};

export function dmyDateString(date: Date): string {
    return `${date.getDate() > 10 ? `${date.getDate()}` : `0${date.getDate()}`}/${
        date.getMonth() + 1 > 10 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
    }/${date.getFullYear()}`;
}

export function userWithoutPassword(user: IUser): IUser {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        publicKey: user.publicKey,
        email: user.email,
        roles: user.roles,
    };
}

export const isReachable = async (url: string): Promise<boolean> => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 2500, 'Request timed out');
    });
    const request = fetch(url);
    try {
        await Promise.race([timeout, request]);
        return true;
    } catch (error) {
        return false;
    }
};
