import { Text, TouchableOpacity, View } from 'react-native';

import { useUserContext } from '@/context/userContext/useUser';
import { ProfileScreenRouteProp } from '@/navigation/types';

function ProfileScreen({ navigation }: ProfileScreenRouteProp) {
    const { user, logoutUser } = useUserContext();

    return (
        <View>
            <Text className="text-white font-bold">{user?.fullName}</Text>
            <TouchableOpacity
                onPress={() => {
                    logoutUser(navigation);
                }}
                className="flex flex-row items-center justify-between py-1 bg-black rounded p-4 mt-2"
            >
                <Text className="text-white font-bold">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
export default ProfileScreen;
