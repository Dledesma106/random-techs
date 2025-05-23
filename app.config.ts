import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const config = ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: 'Tecnicos Random',
        slug: 'random-techs',
        version: '0.1.8',
        orientation: 'portrait',
        icon: './assets/images/logo.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/images/splash2.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-logo.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.dledesma2020.randomtechs',
            googleServicesFile: './google-services.json',
        },
        web: {
            favicon: './assets/images/logo.png',
        },
        extra: {
            eas: {
                projectId: '27b396d4-0e33-4573-ab58-f18a85482277',
            },
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
            awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            awsRegion: process.env.AWS_REGION,
            awsBucketName: process.env.AWS_BUCKET_NAME,
            apiHost: process.env.API_HOST,
            apiBaseUrl: process.env.API_BASE_URL,
            environment: process.env.ENVIRONMENT,
        },
        experiments: {
            tsconfigPaths: true,
        },
        plugins: ['expo-font', 'expo-secure-store', 'expo-build-properties'],
        owner: 'undefineddevs',
    };
};

export default config;
