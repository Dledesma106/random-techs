import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { usePasswordChange } from './mutations';

import { useUserContext } from '@/context/userContext/useUser';

interface UserForm {
    currentPass: string;
    newPassword: string;
    repeatNewPassword: string;
}

function AccountSettings() {
    const { user } = useUserContext();

    const { control, handleSubmit } = useForm<UserForm>({
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<UserForm> = (data) => {
        mutate(
            {
                publicKey: user!.publicKey,
                password: data.newPassword,
                currentPass: data.currentPass,
            },
            {
                onSuccess(data) {
                    console.log(data);
                },
                onError(error) {
                    console.log(error);
                },
            },
        );
    };
    const { mutate } = usePasswordChange();

    return (
        <>
            <View className="flex-1 justify-center items-center px-4 bg-gray-100">
                <View className="w-full mb-4">
                    <Text className="mb-2 text-gray-800">Contraseña Actual</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: 'El nombre es requerido',
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Contraseña"
                                className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                            />
                        )}
                        name="currentPass"
                    />
                </View>

                <View className="w-full mb-6">
                    <Text className="mb-2 text-gray-800">Nueva contraseña</Text>
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
                        name="newPassword"
                    />
                </View>
                <View className="w-full mb-6">
                    <Text className="mb-2 text-gray-800">Confirmar contraseña</Text>
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
                        name="repeatNewPassword"
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit, (e) => {
                        console.log(e);
                    })}
                    className="bg-blue-600 py-3 rounded-lg w-full items-center"
                >
                    <Text className="text-white font-bold">Guardar</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default AccountSettings;
