import { type ClassValue, clsx } from 'clsx';
import { ImageResult, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { twMerge } from 'tailwind-merge';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client, { S3Credentials } from './s3Client';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function dmyDateString(date: Date): string {
    return `${date.getDate() > 10 ? `${date.getDate()}` : `0${date.getDate()}`}/${
        date.getMonth() + 1 > 10 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
    }/${date.getFullYear()}`;
}

export const getCompressedImageAsync = async (imageURI: string) => {
    const filename = imageURI.split('/').pop();
    if (!filename) {
        throw new Error('La imagen no tiene un nombre válido');
    }

    const image = await manipulateAsync(imageURI, [{ resize: { width: 800 } }], {
        compress: 0.5,
        format: SaveFormat.JPEG,
    });

    return { image, filename };
};

export const compressedImageToFormData = ({
    image,
    filename,
}: {
    image: ImageResult;
    filename: string;
}) => {
    return {
        uri: image.uri,
        name: filename,
        type: 'image/jpeg',
    };
};

export function stringifyObject(obj: Record<string, any>): string {
    let resultado = '';
    for (const propiedad in obj) {
        if (obj.hasOwnProperty(propiedad)) {
            resultado += `${propiedad}: ${obj[propiedad]}\n`;
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

export const getS3SignedUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: S3Credentials.bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
};
