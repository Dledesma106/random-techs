import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

import devConfig from './app.config.dev';
import prodConfig from './app.config.prod';

const config = (context: ConfigContext): ExpoConfig => {
    console.log('🔧 Current EXPO_PROJECT_TYPE:', process.env.EXPO_PROJECT_TYPE);

    if (process.env.EXPO_PROJECT_TYPE === 'development') {
        console.log('✅ Using development configuration');
        return devConfig(context);
    } else {
        console.log('✅ Using production configuration');
        return prodConfig(context);
    }
};

export default config;
