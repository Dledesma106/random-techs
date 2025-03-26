import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import useThemeColors from '../../hooks/useThemeColors';

const DarkModeTest = () => {
    const { toggleColorScheme } = useColorScheme();
    const { bgBackground, textForeground, bgSecondary, textSecondary, colorScheme } =
        useThemeColors();

    return (
        <View className={`p-4 ${bgBackground}`}>
            <Text className={`text-lg font-bold ${textForeground}`}>
                Prueba de Modo Oscuro
            </Text>
            <Text className={textForeground}>Tema actual: {colorScheme}</Text>
            <TouchableOpacity
                onPress={toggleColorScheme}
                className={`mt-4 p-3 rounded-md ${bgSecondary}`}
            >
                <Text className={`text-center ${textSecondary}`}>Cambiar tema</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DarkModeTest;
