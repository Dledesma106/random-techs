import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const config = ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Tecnicos Random',
    slug: 'random-techs',
    version: '0.1.3',
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
            projectId: '27b396d4-0e33-4573-ab58-f18a85482277',
        },
        awsAccessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.EXPO_PUBLIC_AWS_REGION,
        awsBucketName: process.env.EXPO_PUBLIC_AWS_BUCKET_NAME,
        apiHost: process.env.EXPO_PUBLIC_API_HOST,
    },
    experiments: {
        tsconfigPaths: true,
    },
    plugins: ['expo-font', 'expo-secure-store', 'expo-build-properties'],
    owner: 'dledesma2020',
});

export default config;
