import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import useBranchesQuery from './queries';

import { BranchesQuery } from '@/api/graphql';
import { RegisterTaskBranchFieldScreenRouteProp } from '@/navigation/types';

const RegisterTaskBranchFieldScreen = ({
    navigation,
    route,
}: RegisterTaskBranchFieldScreenRouteProp) => {
    const queryResult = useBranchesQuery();
    const { value } = route.params;

    const handlePress = (branch: BranchesQuery['branches'][0]) => {
        navigation.navigate({
            name: 'RegisterTask',
            params: { branch },
            merge: true,
        });
    };

    if (queryResult.data) {
        return (
            <View className="flex-1 bg-white">
                <FlatList
                    data={queryResult.data.branches.sort((a, b) => {
                        return a.client.name.localeCompare(b.client.name);
                    })}
                    renderItem={({ item }) => {
                        return (
                            <View className="p-4 border-b border-input" key={item.id}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handlePress(item);
                                    }}
                                >
                                    <View className="flex flex-row justify-between mb-1">
                                        <Text className="font-bold">
                                            {item.client.name} - {item.city.name}
                                        </Text>

                                        {item.id === value && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color="black"
                                            />
                                        )}
                                    </View>

                                    <View className="space-y-1">
                                        <Text>Empresas:</Text>
                                        {item.businesses.map((business) => {
                                            return (
                                                <Text
                                                    key={business.id}
                                                    className="text-muted-foreground"
                                                >
                                                    - {business.name}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item.id}
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
