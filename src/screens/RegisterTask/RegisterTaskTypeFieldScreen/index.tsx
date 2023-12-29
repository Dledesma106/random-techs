import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { TaskType } from '@/models/types';
import { RegisterTaskTypeFieldScreenRouteProps } from '@/navigation/types';

const RegisterTaskTypeFieldScreen = ({
    navigation,
    route,
}: RegisterTaskTypeFieldScreenRouteProps) => {
    const { value } = route.params;
    const handlePress = (type: TaskType) => {
        navigation.navigate({
            name: 'RegisterTask',
            params: {
                type: type,
            },
            merge: true,
        });
    };

    return (
        <View className="flex-1 bg-white">
            <FlatList
                data={[
                    {
                        value: TaskType.Actualizacion,
                        label: 'Actualización',
                    },
                    {
                        value: TaskType.Correctivo,
                        label: 'Correctivo',
                    },
                    {
                        value: TaskType.Instalacion,
                        label: 'Instalación',
                    },
                    {
                        value: TaskType.Desmonte,
                        label: 'Desmonte',
                    },
                    {
                        value: TaskType.Preventivo,
                        label: 'Preventivo',
                    },
                ]}
                renderItem={({ item }) => {
                    return (
                        <View className="p-4 border-b border-input" key={item.value}>
                            <TouchableOpacity
                                className="flex flex-row justify-between"
                                onPress={() => {
                                    handlePress(item.value);
                                }}
                            >
                                <Text>{item.label}</Text>

                                {item.value === value && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={24}
                                        color="black"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    );
                }}
                keyExtractor={(item) => item.value}
            />
        </View>
    );
};

export default RegisterTaskTypeFieldScreen;
