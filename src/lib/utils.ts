import { type ClassValue, clsx } from 'clsx';
import { ImageResult, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { twMerge } from 'tailwind-merge';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Constants from 'expo-constants';

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

const awsAccessKeyId = Constants.expoConfig?.extra?.['awsAccessKeyId'];
const awsBucketName = Constants.expoConfig?.extra?.['awsBucketName'];
const awsRegion = Constants.expoConfig?.extra?.['awsRegion'];
const awsSecretAccessKey = Constants.expoConfig?.extra?.['awsSecretAccessKey'];

export const S3Credentials = {
    bucketName: awsBucketName,
    region: awsRegion,
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
};

const getS3Client = () => {
    const { region, accessKeyId, secretAccessKey } = S3Credentials;
    const s3Client = new S3Client({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });
    return s3Client;
};

export const uploadPhoto = async (uri: string) => {
    const response = await fetch(uri);
    const filename = uri.split(`/`).pop();
    const blob = await response.blob();
    const key = `${Date.now()}-${filename}`;
    const s3Client = getS3Client();

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
    const s3Client = getS3Client();

    const command = new GetObjectCommand({
        Bucket: S3Credentials.bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
};
