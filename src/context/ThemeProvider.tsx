import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    NativeWindStyleSheet,
    useColorScheme as useNativeWindColorScheme,
} from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import useThemeColors from '../hooks/useThemeColors';

type Theme = 'light' | 'dark' | 'system';

// Definimos los colores para ambos temas
type ThemeContextType = {
    theme: Theme;
    colorScheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { colorScheme, setColorScheme } = useNativeWindColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const { bgBackground } = useThemeColors();

    // Cargar el tema guardado al iniciar
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme) {
                    setThemeState(savedTheme as Theme);
                }
            } catch (error) {
                console.error('Error al cargar el tema:', error);
            }
        };
        loadTheme();
    }, []);

    // Actualizar el esquema de colores cuando cambia el tema o el esquema del dispositivo
    useEffect(() => {
        if (theme === 'system') {
            setColorScheme(colorScheme || 'light');
        } else {
            setColorScheme(theme);
        }

        // Aplicar el esquema de colores a NativeWind directamente
        NativeWindStyleSheet.setColorScheme(colorScheme || 'light');

        console.log('ThemeProvider - theme:', theme);
        console.log('ThemeProvider - colorScheme:', colorScheme);
    }, [theme, colorScheme, setColorScheme]);

    const setTheme = async (newTheme: Theme) => {
        console.log('ThemeProvider - setTheme:', newTheme);
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error al guardar el tema:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
            <View className={`flex-1 ${bgBackground}`}>{children}</View>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};
