import 'react-native-get-random-values';
import './src/config/nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReadableStream } from 'web-streams-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import DbProvider from './src/context/dbContext/DbProvider';
import { ThemeProvider } from './src/context/ThemeProvider';
import UserProvider from './src/context/userContext/UserProvider';
import Navigation from './src/navigation';

import useCachedResources from '@/hooks/useCachedResources';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 horas
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1,
            retryDelay: 3000,
        },
        mutations: {
            retry: 1,
            retryDelay: 3000,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            console.log(error);
        },
    }),
});

globalThis.ReadableStream = ReadableStream as any;

export default function App() {
    const isLoadingComplete = useCachedResources();

    onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
            setOnline(!!state.isConnected);
        });
    });

    const persister = createAsyncStoragePersister({
        storage: AsyncStorage,
        key: 'RANDOM_TECHS_QUERY',
    });

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <PersistQueryClientProvider
                    client={queryClient}
                    persistOptions={{ persister }}
                >
                    <ThemeProvider>
                        <RootSiblingParent>
                            <UserProvider>
                                <DbProvider>
                                    <Navigation />
                                </DbProvider>
                            </UserProvider>
                        </RootSiblingParent>
                    </ThemeProvider>
                </PersistQueryClientProvider>
            </SafeAreaProvider>
        );
    }
}
