import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import s3Client, { S3Credentials } from './s3Client';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function dmyDateString(date: Date): string {
    return `${date.getDate() > 10 ? `${date.getDate()}` : `0${date.getDate()}`}/${
        date.getMonth() + 1 > 10 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
    }/${date.getFullYear()}`;
}

export function stringifyObject(obj: Record<string, any>): string {
    let resultado = '';
    for (const propiedad in obj) {
        if (obj.hasOwnProperty(propiedad)) {
            resultado += `${propiedad}: ${typeof obj[propiedad] === 'object' ? (obj[propiedad] instanceof Date ? String(obj[propiedad]) : stringifyObject(obj[propiedad])) : obj[propiedad]}\n`;
        }
    }
    return resultado;
}

export const uploadPhoto = async (uri: string) => {
    const response = await fetch(uri);
    const filename = uri.split(`/`).pop();
    const blob = await response.blob();
    const key = `${Date.now()}-${filename}`;

    const { bucketName } = S3Credentials;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: blob,
        ContentType: 'image/jpeg',
    });
    try {
        await s3Client.send(command);
        return key;
    } catch (error) {
        console.log('error when sending command: ', error);
    }
};

export const deletePhoto = async (key: string) => {
    const { bucketName } = S3Credentials;
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Error deleting file');
    }
};

export const getS3SignedUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: S3Credentials.bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
};

export const getFileSignedUrl = async (key: string, mimeType: string) => {
    const command = new GetObjectCommand({
        Bucket: S3Credentials.bucketName,
        Key: key,
        ResponseContentType: mimeType,
        ResponseContentDisposition: 'inline',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
        url,
        urlExpire: new Date(Date.now() + 3600 * 1000 - 120 * 1000).toISOString(),
    };
};

export function pascalCaseToSpaces(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

// Función auxiliar para comparar fechas ignorando milisegundos
export const areDatesEqual = (
    date1: Date | string | undefined | null,
    date2: Date | string | undefined | null,
): boolean => {
    // Si ambas fechas son nulas o indefinidas, son iguales
    if (!date1 && !date2) return true;
    // Si solo una es nula o indefinida, son diferentes
    if (!date1 || !date2) return false;

    // Convertir a objetos Date si son strings
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

    // Comparar año, mes, día, hora y minuto
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate() &&
        d1.getHours() === d2.getHours() &&
        d1.getMinutes() === d2.getMinutes()
    );
};
