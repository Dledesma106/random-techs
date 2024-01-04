import { type ClassValue, clsx } from 'clsx';
import { ImageResult, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { twMerge } from 'tailwind-merge';

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
