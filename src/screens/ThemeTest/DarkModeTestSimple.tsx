import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import useThemeColors from '../../hooks/useThemeColors';

const DarkModeTestSimple = () => {
    const { toggleColorScheme } = useColorScheme();
    const { bgBackground, textForeground, bgPrimary, textPrimary, colorScheme } =
        useThemeColors();

    return (
        <View className={`p-4 ${bgBackground}`}>
            <Text className={`text-lg font-bold ${textForeground}`}>
                Prueba Simple de Modo Oscuro
            </Text>
            <Text className={textForeground}>Tema actual: {colorScheme}</Text>
            <TouchableOpacity
                onPress={toggleColorScheme}
                className={`mt-4 p-3 rounded-md ${bgPrimary}`}
            >
                <Text className={`text-center ${textPrimary}`}>
                    Cambiar tema (con useThemeColors)
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default DarkModeTestSimple;
