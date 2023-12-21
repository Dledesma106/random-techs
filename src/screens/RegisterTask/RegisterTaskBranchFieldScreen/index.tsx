import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { DeviceEventEmitter, FlatList, Text, TouchableOpacity, View } from 'react-native';

import useBranchesQuery, { FetchBranchesBranchItem } from './queries';

import { RegisterTaskBranchFieldScreenRouteProp } from '@/navigation/types';

const EVENT_NAME = 'RegisterTaskBranchFieldScreen';

export const addRegisterTaskBranchFieldScreenListener = (
    callback: (branch: FetchBranchesBranchItem) => void,
) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeRegisterTaskBranchFieldScreenListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitRegisterTaskBranchFieldScreenEvent = (branch: FetchBranchesBranchItem) => {
    DeviceEventEmitter.emit(EVENT_NAME, branch);
};

const RegisterTaskBranchFieldScreen = ({
    navigation,
    route,
}: RegisterTaskBranchFieldScreenRouteProp) => {
    const queryResult = useBranchesQuery();
    const { value } = route.params;

    useEffect(() => {
        return () => {
            removeRegisterTaskBranchFieldScreenListener();
        };
    }, []);

    const handlePress = (branch: FetchBranchesBranchItem) => {
        emitRegisterTaskBranchFieldScreenEvent(branch);
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
                                    <Text>{item.city.name}</Text>

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

export default RegisterTaskBranchFieldScreen;
