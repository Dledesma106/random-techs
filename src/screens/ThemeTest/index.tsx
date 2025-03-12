import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { useTheme } from '../../context/ThemeProvider';

const ThemeTest = () => {
    const { colorScheme, toggleTheme, setTheme } = useTheme();
    const isDark = colorScheme === 'dark';

    return (
        <ScrollView
            className={`flex-1 p-4 ${isDark ? 'bg-dark-background' : 'bg-white'}`}
        >
            <View className="mb-6">
                <Text
                    className={`text-2xl font-bold mb-2 ${isDark ? 'text-dark-foreground' : 'text-foreground'}`}
                >
                    Prueba de NativeWind en Expo Go
                </Text>
                <Text
                    className={`mb-4 ${isDark ? 'text-dark-muted-foreground' : 'text-muted-foreground'}`}
                >
                    Tema actual: {colorScheme}
                </Text>

                <View className="flex-row space-x-2 mb-6">
                    <TouchableOpacity
                        onPress={() => setTheme('light')}
                        className={`flex-1 py-3 px-4 rounded-md ${
                            colorScheme === 'light'
                                ? isDark
                                    ? 'bg-dark-primary'
                                    : 'bg-primary'
                                : isDark
                                  ? 'bg-dark-secondary'
                                  : 'bg-secondary'
                        }`}
                    >
                        <Text
                            className={`text-center font-medium ${
                                colorScheme === 'light'
                                    ? isDark
                                        ? 'text-dark-primary-foreground'
                                        : 'text-primary-foreground'
                                    : isDark
                                      ? 'text-dark-secondary-foreground'
                                      : 'text-secondary-foreground'
                            }`}
                        >
                            Tema Claro
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTheme('dark')}
                        className={`flex-1 py-3 px-4 rounded-md ${
                            colorScheme === 'dark'
                                ? isDark
                                    ? 'bg-dark-primary'
                                    : 'bg-primary'
                                : isDark
                                  ? 'bg-dark-secondary'
                                  : 'bg-secondary'
                        }`}
                    >
                        <Text
                            className={`text-center font-medium ${
                                colorScheme === 'dark'
                                    ? isDark
                                        ? 'text-dark-primary-foreground'
                                        : 'text-primary-foreground'
                                    : isDark
                                      ? 'text-dark-secondary-foreground'
                                      : 'text-secondary-foreground'
                            }`}
                        >
                            Tema Oscuro
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={toggleTheme}
                    className={`py-3 px-4 rounded-md mb-6 ${isDark ? 'bg-dark-primary' : 'bg-primary'}`}
                >
                    <Text
                        className={`text-center font-medium ${isDark ? 'text-dark-primary-foreground' : 'text-primary-foreground'}`}
                    >
                        Alternar Tema
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="space-y-4">
                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-primary' : 'bg-primary'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-primary-foreground' : 'text-primary-foreground'}`}
                    >
                        Primary
                    </Text>
                </View>

                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-secondary' : 'bg-secondary'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-secondary-foreground' : 'text-secondary-foreground'}`}
                    >
                        Secondary
                    </Text>
                </View>

                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-muted' : 'bg-muted'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-muted-foreground' : 'text-muted-foreground'}`}
                    >
                        Muted
                    </Text>
                </View>

                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-accent' : 'bg-accent'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-accent-foreground' : 'text-accent-foreground'}`}
                    >
                        Accent
                    </Text>
                </View>

                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-destructive' : 'bg-destructive'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-destructive-foreground' : 'text-destructive-foreground'}`}
                    >
                        Destructive
                    </Text>
                </View>

                <View
                    className={`p-4 rounded-md ${isDark ? 'bg-dark-card' : 'bg-white'}`}
                >
                    <Text
                        className={`font-medium ${isDark ? 'text-dark-foreground' : 'text-foreground'}`}
                    >
                        Card
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ThemeTest;
