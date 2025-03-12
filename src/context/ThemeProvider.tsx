import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';
type ThemeContextType = {
    theme: Theme;
    colorScheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const deviceColorScheme = useDeviceColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
        deviceColorScheme || 'light',
    );

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
            setColorScheme(deviceColorScheme || 'light');
        } else {
            setColorScheme(theme);
        }
    }, [theme, deviceColorScheme]);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error al guardar el tema:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = colorScheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setTheme, toggleTheme }}>
            {children}
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
