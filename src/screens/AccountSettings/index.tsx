import { SubmitHandler, useForm } from 'react-hook-form';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

import { usePasswordChange } from './mutations';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { AccountSettingsScreenRouteProps } from '@/navigation/types';

interface UserForm {
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}

function AccountSettings({ navigation }: AccountSettingsScreenRouteProps) {
    const form = useForm<UserForm>();
    const { mutate, isPending } = usePasswordChange();

    const onSubmit: SubmitHandler<UserForm> = (data) => {
        mutate(
            {
                newPassword: data.newPassword,
                currentPassword: data.currentPassword,
            },
            {
                onSuccess() {
                    Toast.show('Contraseña cambiada correctamente');
                    navigation.goBack();
                },
                onError(error) {
                    const status = error.response?.status;
                    if (status === 403) {
                        form.setError('currentPassword', {
                            type: 'manual',
                            message: 'La contraseña actual es incorrecta',
                        });
                    } else {
                        Toast.show('Ocurrió un error al cambiar la contraseña');
                    }
                },
            },
        );
    };

    return (
        <KeyboardAwareScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
            }}
        >
            <TouchableWithoutFeedback className="flex-1 bg-white">
                <View className="flex-1 justify-center px-4 bg-white">
                    <Text className="text-2xl font-bold mb-4 text-center">
                        Cambiar contraseña
                    </Text>

                    <Form {...form}>
                        <View className="space-y-4 mb-6">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                rules={{
                                    required: 'Este campo es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña Actual</FormLabel>
                                        <TextInput
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChangeText={field.onChange}
                                            placeholder="Contraseña actual"
                                            secureTextEntry
                                        />
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
                                        <TextInput
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChangeText={field.onChange}
                                            placeholder="Nueva contraseña"
                                            secureTextEntry
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="repeatNewPassword"
                                rules={{
                                    required: 'Este campo es requerido',
                                    validate: (value) =>
                                        value === form.getValues().newPassword ||
                                        'Las contraseñas no coinciden',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar nueva contraseña</FormLabel>
                                        <TextInput
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChangeText={field.onChange}
                                            placeholder="Confirmar nueva contraseña"
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
                        Guardar
                    </ButtonWithSpinner>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
}

export default AccountSettings;
