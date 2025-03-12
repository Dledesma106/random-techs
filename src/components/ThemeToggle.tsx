import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../context/ThemeProvider';

const ThemeToggle = () => {
    const { colorScheme, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const isDark = colorScheme === 'dark';

    return (
        <View className="flex-row items-center space-x-2">
            <TouchableOpacity
                onPress={toggleTheme}
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-dark-secondary' : 'bg-secondary'}`}
            >
                <Text
                    className={`${isDark ? 'text-dark-secondary-foreground' : 'text-secondary-foreground'}`}
                >
                    {colorScheme === 'dark' ? '🌙' : '☀️'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ThemeTest' as never)}
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-dark-primary' : 'bg-primary'}`}
            >
                <Text
                    className={`${isDark ? 'text-dark-primary-foreground' : 'text-primary-foreground'}`}
                >
                    Prueba de Tema
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ThemeToggle;
