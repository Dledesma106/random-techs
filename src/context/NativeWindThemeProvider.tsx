import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';

import { useTheme } from './ThemeProvider';

export const NativeWindThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { colorScheme } = useTheme();
    const { setColorScheme: setNativeWindColorScheme } = useColorScheme();

    // Sincronizar el tema de NativeWind con nuestro tema
    useEffect(() => {
        console.log('Actualizando tema de NativeWind a:', colorScheme);
        setNativeWindColorScheme(colorScheme);
    }, [colorScheme, setNativeWindColorScheme]);

    return <>{children}</>;
};
