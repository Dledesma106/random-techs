import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import UserProvider from './context/userContext/UserProvider';
import DbProvider from './context/dbContext/DbProvider';
import { useBcryptConfig } from './hooks/useBcryptConfig';
import { useEffect } from 'react';



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const configureBcrypt = useBcryptConfig()

  useEffect(()=>{
    configureBcrypt()

  },[])

  //console.log('rendered app')

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
