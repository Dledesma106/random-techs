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
    },
    experiments: {
        tsconfigPaths: true,
    },
    plugins: ['expo-font', 'expo-secure-store'],
});

export default config;
