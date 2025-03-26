import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useState } from 'react';
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
    TouchableOpacity,
} from 'react-native';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import CollapsableText from '@/components/CollapsableText';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { useUserContext } from '@/context/userContext/useUser';
import useLogin from '@/hooks/api/auth/useLogin';
import { useThemeColors } from '@/hooks/useThemeColors';
import JWTTokenService from '@/lib/JWTTokenService';
import { S3Credentials } from '@/lib/s3Client';
import { stringifyObject } from '@/lib/utils';
import { RootStackParamList } from '@/navigation/types';
const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';
interface LoginForm {
    email: string;
    password: string;
}

const apiHost = Constants.expoConfig?.extra?.['apiHost'];
const apiBaseUrl = Constants.expoConfig?.extra?.['apiBaseUrl'];

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const { mutate, error, isPending } = useLogin();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { setUser } = useUserContext();
    const {
        colors: {
            primary: { DEFAULT: primary, foreground },
        },
    } = useThemeColors();

    const form = useForm<LoginForm>({
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<LoginForm> = (data) => {
        mutate(data, {
            onSuccess: async (data, { password }) => {
                const { accessToken, user } = data.login;

                if (!accessToken || !user) {
                    Alert.alert('Error', 'No se pudo iniciar sesión');
                    return;
                }

                await JWTTokenService.saveAsync(accessToken);
                setUser(user, password);
                navigation.replace('Drawer');
            },
            onError: (error) => {
                console.log(error);
                Alert.alert('Error', error.message);
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
                        {isDevelopment && (
                            <>
                                <CollapsableText
                                    buttonText="datos de desarrollo"
                                    text={stringifyObject({
                                        ...S3Credentials,
                                        apiHost,
                                        apiBaseUrl,
                                    })}
                                />
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ThemeTest')}
                                    className={`bg-[${primary}] py-3 px-4 rounded-md mb-6`}
                                >
                                    <Text
                                        className={`text-[${foreground}] text-center font-medium`}
                                    >
                                        Probar Temas (NativeWind)
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <Text className="text-2xl font-bold mb-4 text-gray-800 text-center">
                            Tecnicos Random
                        </Text>

                        {/* Botón para acceder a la pantalla de prueba de tema */}

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
                                                autoCapitalize="none"
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
                                            <View className="relative">
                                                <TextInput
                                                    value={field.value}
                                                    onChangeText={field.onChange}
                                                    onBlur={field.onBlur}
                                                    ref={field.ref}
                                                    placeholder="Contraseña"
                                                    secureTextEntry={!isPasswordVisible}
                                                    autoCapitalize="none"
                                                    icon={
                                                        <Feather
                                                            name={
                                                                !isPasswordVisible
                                                                    ? 'eye'
                                                                    : 'eye-off'
                                                            }
                                                            size={24}
                                                            color="#000"
                                                        />
                                                    }
                                                    onIconPress={() =>
                                                        setIsPasswordVisible(
                                                            !isPasswordVisible,
                                                        )
                                                    }
                                                />
                                            </View>
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
                                {error && `Error al iniciar sesión: ${error.message}`}
                            </Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default LoginScreen;
