import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

import DarkModeTest from './DarkModeTest';
import DarkModeTestSimple from './DarkModeTestSimple';

import { ThemeToggle } from '../../components/ThemeToggle';
import useThemeColors from '../../hooks/useThemeColors';

const ThemeTest = () => {
    const { colorScheme } = useThemeColors();

    useEffect(() => {
        console.log('ThemeTest - colorScheme:', colorScheme);
    }, [colorScheme]);

    return (
        <ScrollView className={`flex-1 p-4 bg-background`}>
            <Text className={`text-2xl font-bold mb-2 text-foreground`}>
                Prueba de Tema con NativeWind
            </Text>

            <Text className={`mb-4 text-muted-foreground`}>
                Tema actual: {colorScheme}
            </Text>

            <ThemeToggle />

            {/* Componente de prueba simple para modo oscuro */}
            <View className={`mt-6 p-4 border border-border rounded-md`}>
                <Text className={`text-lg font-bold mb-2 text-foreground`}>
                    Componente de prueba simple:
                </Text>
                <DarkModeTestSimple />
            </View>

            {/* Componente de prueba para modo oscuro */}
            <View className={`mt-6 p-4 border border-border rounded-md`}>
                <Text className={`text-lg font-bold mb-2 text-foreground`}>
                    Componente de prueba:
                </Text>
                <DarkModeTest />
            </View>

            {/* Ejemplo de uso directo de los colores del tema */}
            <View className={`mt-6 p-4 rounded-md bg-accent`}>
                <Text className={`font-bold text-accent-foreground`}>
                    Este componente usa los colores del tema directamente
                </Text>
            </View>

            <View className="mt-6 space-y-4">
                <View className={`p-4 rounded-md bg-background-primary`}>
                    <Text className={`font-medium text-foreground`}>Primary</Text>
                </View>

                <View className={`p-4 rounded-md bg-secondary`}>
                    <Text className={`font-medium text-secondary-foreground`}>
                        Secondary
                    </Text>
                </View>

                <View className={`p-4 rounded-md bg-muted`}>
                    <Text className={`font-medium text-muted-foreground`}>Muted</Text>
                </View>

                <View className={`p-4 rounded-md bg-accent`}>
                    <Text className={`font-medium text-accent-foreground`}>Accent</Text>
                </View>

                <View className={`p-4 rounded-md bg-destructive`}>
                    <Text className={`font-medium text-destructive-foreground`}>
                        Destructive
                    </Text>
                </View>

                <View className={`p-4 rounded-md bg-card`}>
                    <Text className={`font-medium text-card-foreground`}>Card</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ThemeTest;
