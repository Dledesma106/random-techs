import { Text, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { useUserContext } from '@/context/userContext/useUser';
import { ProfileScreenRouteProp } from '@/navigation/types';

function ProfileScreen({ navigation }: ProfileScreenRouteProp) {
    const { user, logoutUser } = useUserContext();

    return (
        <View className="bg-white flex-1 px-4 py-4">
            <View className="mb-4">
                <Text className="font-bold text-lg mb-1">Hola, {user?.fullName}</Text>
                <Text className="text-gray-500">¿Que quieres hacer hoy?</Text>
            </View>

            <View className="space-y-4">
                <Button
                    variant="secondary"
                    onPress={() => {
                        navigation.navigate('AccountSettings');
                    }}
                >
                    <ButtonText>Cambiar contraseña</ButtonText>
                </Button>

                <Button
                    onPress={() => {
                        logoutUser(navigation);
                    }}
                >
                    <ButtonText>Cerrar sesión</ButtonText>
                </Button>
            </View>
        </View>
    );
}
export default ProfileScreen;
