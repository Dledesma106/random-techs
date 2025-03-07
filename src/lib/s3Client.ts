import { S3Client } from '@aws-sdk/client-s3';
import Constants from 'expo-constants';

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

const { region, accessKeyId, secretAccessKey } = S3Credentials;
const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

export default s3Client;
