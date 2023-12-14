import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useLoginMutation } from './mutations';

import { useUser } from '@/hooks/useUser';
import JWTTokenService from '@/lib/JWTTokenService';
import { RootStackParamList } from '@/navigation/types';

interface LoginForm {
    email: string;
    password: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const { mutate, error, isPending } = useLoginMutation();
    const { setUser } = useUser();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<LoginForm> = (data) => {
        mutate(data, {
            onSuccess: async (data) => {
                await JWTTokenService.save(data.accessToken);
                setUser(data.user);
                navigation.navigate('Drawer');
            },
        });
    };

    return (
        <View className="flex-1 justify-center items-center px-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-4 text-gray-800">Login</Text>

            <View className="w-full mb-4">
                <Text className="mb-2 text-gray-800">Email</Text>
                <Controller
                    control={control}
                    rules={{
                        required: 'El correo es requerido',
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'El correo no es válido',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Correo"
                            className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                        />
                    )}
                    name="email"
                />
                {errors.email && (
                    <Text className="text-red-500 mt-1">{errors.email.message}</Text>
                )}
            </View>

            <View className="w-full mb-6">
                <Text className="mb-2 text-gray-800">Contraseña</Text>
                <Controller
                    control={control}
                    rules={{ required: 'La contraseña es requerida' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Contraseña"
                            secureTextEntry
                            className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                        />
                    )}
                    name="password"
                />
                {errors.password && (
                    <Text className="text-red-500 mt-1">{errors.password.message}</Text>
                )}
            </View>

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="bg-blue-600 py-3 rounded-lg w-full items-center"
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text className="text-white font-bold">Iniciar Sesión</Text>
                )}
            </TouchableOpacity>

            {error && !isPending && (
                <Text className="text-red-500 mt-4">
                    {error.response?.status === 403
                        ? 'Credenciales incorrectas'
                        : 'Error al iniciar sesión'}
                </Text>
            )}
        </View>
    );
};

export default LoginScreen;
