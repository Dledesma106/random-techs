import { SubmitHandler, useForm } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { usePasswordChange } from './mutations';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserContext } from '@/context/userContext/useUser';

interface UserForm {
    currentPass: string;
    newPassword: string;
    repeatNewPassword: string;
}

function AccountSettings() {
    const { user } = useUserContext();

    const form = useForm<UserForm>({
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
        <View className="flex-1 justify-center items-center px-4 bg-gray-100">
            <Form {...form}>
                <View className="space-y-4 mb-6">
                    <FormField
                        control={form.control}
                        name="currentPass"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña Actual</FormLabel>
                                <TextInput {...field} placeholder="Contraseña actual" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nueva contraseña</FormLabel>
                                <TextInput {...field} placeholder="Nueva contraseña" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="repeatNewPassword"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar nueva contraseña</FormLabel>
                                <TextInput
                                    {...field}
                                    placeholder="Confirmar nueva contraseña"
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
            >
                <Text className="text-white font-bold">Guardar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default AccountSettings;
