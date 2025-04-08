import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import useThemeColors from '../../hooks/useThemeColors';

const DarkModeTest = () => {
    const { toggleColorScheme } = useColorScheme();
    const { colorScheme } = useThemeColors();

    return (
        <View className={`p-4 bg-red-500 dark:bg-blue-500`}>
            <Text className={`text-lg font-bold text-foreground`}>
                Prueba de Modo Oscuro
            </Text>
            <Text className={`text-foreground`}>Tema actual: {colorScheme}</Text>
            <TouchableOpacity
                onPress={toggleColorScheme}
                className={`mt-4 p-3 rounded-md bg-secondary`}
            >
                <Text className={`text-center text-secondary-foreground`}>
                    Cambiar tema
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default DarkModeTest;
