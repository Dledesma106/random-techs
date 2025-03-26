import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import useThemeColors from '../hooks/useThemeColors';

export const ThemeToggle = () => {
    const { toggleColorScheme, setColorScheme } = useColorScheme();
    const { bgSecondary, textSecondary, bgDestructive, textDestructive, colorScheme } =
        useThemeColors();

    useEffect(() => {
        console.log('ThemeToggle - colorScheme:', colorScheme);
    }, [colorScheme]);

    return (
        <View className="p-4">
            <TouchableOpacity
                onPress={toggleColorScheme}
                className={`${bgSecondary} p-3 rounded-md mb-2`}
            >
                <Text className={`text-center ${textSecondary}`}>
                    Tema actual: {colorScheme} - Toca para cambiar
                </Text>
            </TouchableOpacity>

            <View className="flex-row space-x-2">
                <ThemeSelector
                    theme="light"
                    currentTheme={colorScheme}
                    onPress={() => setColorScheme('light')}
                />
                <ThemeSelector
                    theme="dark"
                    currentTheme={colorScheme}
                    onPress={() => setColorScheme('dark')}
                />
                <ThemeSelector
                    theme="system"
                    currentTheme={colorScheme}
                    onPress={() => setColorScheme('system')}
                />
            </View>

            {/* Ejemplo de uso directo de los colores del tema */}
            <TouchableOpacity
                className={`mt-4 p-3 rounded-md ${bgDestructive}`}
                onPress={toggleColorScheme}
            >
                <Text className={`text-center ${textDestructive} font-bold`}>
                    Botón con estilos del tema
                </Text>
            </TouchableOpacity>
        </View>
    );
};

interface ThemeSelectorProps {
    theme: 'light' | 'dark' | 'system';
    currentTheme: string;
    onPress: () => void;
}

const ThemeSelector = ({ theme, currentTheme, onPress }: ThemeSelectorProps) => {
    const isSelected = theme === currentTheme;
    const { bgPrimary, textPrimary, bgSecondary, textSecondary } = useThemeColors();

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 p-2 rounded-md ${isSelected ? bgPrimary : bgSecondary}`}
        >
            <Text className={`text-center ${isSelected ? textPrimary : textSecondary}`}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
        </TouchableOpacity>
    );
};
