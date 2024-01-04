import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
    View,
    Text,
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';

import { useLoginMutation } from './mutations';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
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
            onSuccess: async (data, { password }) => {
                const { accessToken, user } = data.login;
                console.log(accessToken);
                console.log(user);

                if (!accessToken || !user) {
                    Alert.alert('Error', 'No se pudo iniciar sesión');
                    return;
                }

                await JWTTokenService.saveAsync(accessToken);
                setUser(user, password);
                navigation.replace('Drawer');
            },
        });
    };

    return (
        <SafeAreaView className="flex-1">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 bg-white flex justify-center"
                >
                    <View className="px-4 w-full">
                        <Text className="text-2xl font-bold mb-4 text-gray-800 text-center">
                            Random Tech
                        </Text>

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
                                            <TextInput
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                                placeholder="Email"
                                            />
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
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                                placeholder="Contraseña"
                                                secureTextEntry
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </View>
                        </Form>

                        <ButtonWithSpinner
                            onPress={form.handleSubmit(onSubmit)}
                            showSpinner={isPending}
                        >
                            Iniciar Sesión
                        </ButtonWithSpinner>

                        {error && !isPending && (
                            <Text className="text-red-500 mt-4">
                                {error && 'Error al iniciar sesión'}
                            </Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default LoginScreen;
