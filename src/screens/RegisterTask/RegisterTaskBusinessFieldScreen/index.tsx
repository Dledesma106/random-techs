import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { DeviceEventEmitter, FlatList, Text, TouchableOpacity, View } from 'react-native';

import useBusinessesQuery, { FetchBusinessesDataItem } from './queries';

import { RegisterTaskBusinessFieldScreenRouteProps } from '@/navigation/types';

const EVENT_NAME = 'RegisterTaskBusinessFieldScreen';

export const addRRegisterTaskBusinessFieldScreenListener = (
    callback: (branch: FetchBusinessesDataItem) => void,
) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeRegisterTaskBusinessFieldScreenListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitRegisterTaskBusinessFieldScreenEvent = (data: FetchBusinessesDataItem) => {
    DeviceEventEmitter.emit(EVENT_NAME, data);
};

const RegisterTaskBusinessFieldScreen = ({
    navigation,
    route,
}: RegisterTaskBusinessFieldScreenRouteProps) => {
    const queryResult = useBusinessesQuery();
    const { value } = route.params;

    useEffect(() => {
        return () => {
            removeRegisterTaskBusinessFieldScreenListener();
        };
    }, []);

    const handlePress = (branch: FetchBusinessesDataItem) => {
        emitRegisterTaskBusinessFieldScreenEvent(branch);
        navigation.goBack();
    };

    if (queryResult.data) {
        return (
            <View className="flex-1 bg-white">
                <FlatList
                    data={queryResult.data}
                    renderItem={({ item }) => {
                        return (
                            <View className="p-4 border-b border-input" key={item._id}>
                                <TouchableOpacity
                                    className="flex flex-row justify-between"
                                    onPress={() => {
                                        handlePress(item);
                                    }}
                                >
                                    <Text>{item.name}</Text>

                                    {item._id === value && (
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
                    keyExtractor={(item) => item._id}
                />
            </View>
        );
    }

    if (queryResult.isError) {
        return (
            <View>
                <Text>Error...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
};

export default RegisterTaskBusinessFieldScreen;
