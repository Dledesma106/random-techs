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
        API_BASE_URL: 'http://192.168.1.37:3000/',
        // eas: {
        //     projectId: '27b396d4-0e33-4573-ab58-f18a85482277',
        // },
    },
    experiments: {
        tsconfigPaths: true,
    },
});

export default config;
