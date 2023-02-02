import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import UserProvider from './context/userContext/UserProvider';
import { NativeWindStyleSheet } from "nativewind";
import DbProvider from './context/dbContext/DbProvider';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <DbProvider>
          <UserProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </UserProvider>
        </DbProvider>
      </SafeAreaProvider>
    );
  }
}
