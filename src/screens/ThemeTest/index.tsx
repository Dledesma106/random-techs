import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

import DarkModeTest from './DarkModeTest';
import DarkModeTestSimple from './DarkModeTestSimple';

import { ThemeToggle } from '../../components/ThemeToggle';
import useThemeColors from '../../hooks/useThemeColors';

const ThemeTest = () => {
    const {
        bgBackground,
        textForeground,
        textMuted,
        border,
        bgBackgroundPrimary,
        textPrimary,
        bgSecondary,
        textSecondary,
        bgMuted,
        textMuted: textMutedFg,
        bgAccent,
        textAccent,
        bgDestructive,
        textDestructive,
        bgCard,
        textCard,
        colorScheme,
    } = useThemeColors();

    useEffect(() => {
        console.log('ThemeTest - colorScheme:', colorScheme);
    }, [colorScheme]);

    return (
        <ScrollView className={`flex-1 p-4 ${bgBackground}`}>
            <Text className={`text-2xl font-bold mb-2 ${textForeground}`}>
                Prueba de Tema con NativeWind
            </Text>

            <Text className={`mb-4 ${textMuted}`}>Tema actual: {colorScheme}</Text>

            <ThemeToggle />

            {/* Componente de prueba simple para modo oscuro */}
            <View className={`mt-6 p-4 border ${border} rounded-md`}>
                <Text className={`text-lg font-bold mb-2 ${textForeground}`}>
                    Componente de prueba simple:
                </Text>
                <DarkModeTestSimple />
            </View>

            {/* Componente de prueba para modo oscuro */}
            <View className={`mt-6 p-4 border ${border} rounded-md`}>
                <Text className={`text-lg font-bold mb-2 ${textForeground}`}>
                    Componente de prueba:
                </Text>
                <DarkModeTest />
            </View>

            {/* Ejemplo de uso directo de los colores del tema */}
            <View className={`mt-6 p-4 rounded-md ${bgAccent}`}>
                <Text className={`font-bold ${textAccent}`}>
                    Este componente usa los colores del tema directamente
                </Text>
            </View>

            <View className="mt-6 space-y-4">
                <View className={`p-4 rounded-md ${bgBackgroundPrimary}`}>
                    <Text className={`font-medium ${textPrimary}`}>Primary</Text>
                </View>

                <View className={`p-4 rounded-md ${bgSecondary}`}>
                    <Text className={`font-medium ${textSecondary}`}>Secondary</Text>
                </View>

                <View className={`p-4 rounded-md ${bgMuted}`}>
                    <Text className={`font-medium ${textMutedFg}`}>Muted</Text>
                </View>

                <View className={`p-4 rounded-md ${bgAccent}`}>
                    <Text className={`font-medium ${textAccent}`}>Accent</Text>
                </View>

                <View className={`p-4 rounded-md ${bgDestructive}`}>
                    <Text className={`font-medium ${textDestructive}`}>Destructive</Text>
                </View>

                <View className={`p-4 rounded-md ${bgCard}`}>
                    <Text className={`font-medium ${textCard}`}>Card</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ThemeTest;
