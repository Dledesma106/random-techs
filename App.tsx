import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DbProvider from './src/context/dbContext/DbProvider';
import UserProvider from './src/context/userContext/UserProvider';
import { useBcryptConfig } from './src/hooks/useBcryptConfig';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';

import useCachedResources from '@/hooks/useCachedResources';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24,
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export default function App() {
    const appIsReady = useCachedResources();

    const colorScheme = useColorScheme();
    const configureBcrypt = useBcryptConfig();

    useEffect(() => {
        configureBcrypt();
    }, []);

    onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
            setOnline(!!state.isConnected);
        });
    });

    if (!appIsReady) {
        return null;
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
            onSuccess={() =>
                queryClient
                    .resumePausedMutations()
                    .then(() => queryClient.invalidateQueries())
            }
        >
            <SafeAreaProvider>
                <DbProvider>
                    <UserProvider>
                        <Navigation colorScheme={colorScheme} />
                        <StatusBar />
                    </UserProvider>
                </DbProvider>
            </SafeAreaProvider>
        </PersistQueryClientProvider>
    );
}
