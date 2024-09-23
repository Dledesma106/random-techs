import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const config = ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'random-techs',
    slug: 'random-techs',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
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
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        package: 'com.dledesma2020.randomtechs',
    },
    web: {
        favicon: './assets/images/favicon.png',
    },
    extra: {
        eas: {
            projectId: '4a11cd9d-e6c8-4fa5-9703-7a61273e35bf',
        },
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION,
        awsBucketName: process.env.AWS_BUCKET_NAME,
        apiHost: process.env.EXPO_PUBLIC_API_HOST,
    },
    experiments: {
        tsconfigPaths: true,
    },
    plugins: ['expo-font', 'expo-secure-store', 'expo-build-properties'],
});

export default config;
