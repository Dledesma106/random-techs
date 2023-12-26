import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, SubmitHandler } from 'react-hook-form';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useLoginMutation } from './mutations';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { useUserContext } from '@/context/userContext/useUser';
import JWTTokenService from '@/lib/JWTTokenService';
import { RootStackParamList } from '@/navigation/types';

interface LoginForm {
    email: string;
    password: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const { mutate, error, isPending } = useLoginMutation();
    const { setUser } = useUserContext();

    const form = useForm<LoginForm>({
        reValidateMode: 'onSubmit',
        defaultValues:
            process.env.NODE_ENV === 'development'
                ? {
                      email: 'acosta.enzo@hotmail.com',
                      password: '123qweasd',
                  }
                : undefined,
    });

    const onSubmit: SubmitHandler<LoginForm> = (data) => {
        mutate(data, {
            onSuccess: async (data) => {
                await JWTTokenService.save(data.accessToken);
                setUser(data.user);
                navigation.replace('Drawer');
            },
        });
    };

    return (
        <View className="flex-1 justify-center items-center px-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-4 text-gray-800">Random Tech</Text>

            <Form {...form}>
                <View className="space-y-4 mb-6 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{
                            required: 'El correo es requerido',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'El correo no es válido',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <TextInput {...field} placeholder="Email" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        rules={{ required: 'La contraseña es requerida' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <TextInput
                                    {...field}
                                    placeholder="Contraseña"
                                    secureTextEntry
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </View>
            </Form>

            <TouchableOpacity
                onPress={form.handleSubmit(onSubmit)}
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
