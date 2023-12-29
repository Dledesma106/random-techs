import { Ionicons } from '@expo/vector-icons';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import useBusinessesQuery, { FetchBusinessesDataItem } from './queries';

import { RegisterTaskBusinessFieldScreenRouteProps } from '@/navigation/types';

const RegisterTaskBusinessFieldScreen = ({
    navigation,
    route,
}: RegisterTaskBusinessFieldScreenRouteProps) => {
    const { value, branchId } = route.params;
    const queryResult = useBusinessesQuery(branchId);

    const handlePress = (branch: FetchBusinessesDataItem) => {
        navigation.navigate({
            name: 'RegisterTask',
            params: {
                business: branch,
            },
            merge: true,
        });
    };

    if (queryResult.data) {
        return (
            <View className="flex-1 bg-white">
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={queryResult.fetchStatus === 'fetching'}
                            onRefresh={queryResult.refetch}
                        />
                    }
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={queryResult.fetchStatus === 'fetching'}
                        onRefresh={queryResult.refetch}
                    />
                }
            >
                <Text>Error...</Text>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={queryResult.fetchStatus === 'fetching'}
                    onRefresh={queryResult.refetch}
                />
            }
        >
            <Text>Loading...</Text>
        </ScrollView>
    );
};

export default RegisterTaskBusinessFieldScreen;
