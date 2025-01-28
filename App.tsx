import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReadableStream } from 'web-streams-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import DbProvider from './src/context/dbContext/DbProvider';
import UserProvider from './src/context/userContext/UserProvider';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';

import useCachedResources from '@/hooks/useCachedResources';
import { showToast } from '@/lib/toast';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24,
        },
    },
    queryCache: new QueryCache({
        onError: () => {
            return showToast('Ocurrió un error al realizar la operación', 'error');
        },
    }),
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

globalThis.ReadableStream = ReadableStream as any;

export default function App() {
    const appIsReady = useCachedResources();

    const colorScheme = useColorScheme();

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
            <RootSiblingParent>
                <SafeAreaProvider>
                    <DbProvider>
                        <UserProvider>
                            <Navigation colorScheme={colorScheme} />
                            <StatusBar />
                        </UserProvider>
                    </DbProvider>
                </SafeAreaProvider>
            </RootSiblingParent>
        </PersistQueryClientProvider>
    );
}
