import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
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
    const { colorScheme, setColorScheme } = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const { bgBackground } = useThemeColors();

    // Cargar el tema guardado al iniciar
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme) {
                    setThemeState(savedTheme as Theme);
                    if (savedTheme !== 'system') {
                        setColorScheme(savedTheme as 'light' | 'dark');
                    }
                }
            } catch (error) {
                console.error('Error al cargar el tema:', error);
            }
        };
        loadTheme();
    }, [setColorScheme]);

    const setTheme = async (newTheme: Theme) => {
        console.log('ThemeProvider - setTheme:', newTheme);
        setThemeState(newTheme);
        if (newTheme !== 'system') {
            setColorScheme(newTheme as 'light' | 'dark');
        }
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error al guardar el tema:', error);
        }
    };

    const currentColorScheme = colorScheme || 'light';

    return (
        <ThemeContext.Provider
            value={{ theme, colorScheme: currentColorScheme, setTheme }}
        >
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
