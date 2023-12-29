import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, SafeAreaView, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

import { useCreateTaskMutation } from './mutations';
import { FetchBranchesBranchItem } from './RegisterTaskBranchFieldScreen/queries';
import { FetchBusinessesDataItem } from './RegisterTaskBusinessFieldScreen/queries';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputFromOuterScreen, TextInput } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { TaskType } from '@/models/types';
import { RegisterTaskScreenProp } from '@/navigation/types';

export type CreateTaskFormValues = {
    branch?: {
        value: FetchBranchesBranchItem;
        label: string;
    };
    business?: {
        value: FetchBusinessesDataItem;
        label: string;
    } | null;
    taskType?: TaskType | null;
    description?: string;
    workOrderNumber?: number;
};

const RegisterTask = ({ navigation, route }: RegisterTaskScreenProp) => {
    const form = useForm<CreateTaskFormValues>();
    const createTaskMutation = useCreateTaskMutation({
        onSuccess: () => {
            navigation.setParams({
                branch: null,
                business: null,
                type: null,
            });
            Toast.show('Tarea creada', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });

            form.reset();
        },
    });

    useEffect(() => {
        if (!route.params) {
            return;
        }

        const { branch, business, type } = route.params;
        if (branch) {
            form.setValue('branch', {
                value: branch,
                label: branch.city.name,
            });
        }

        if (business) {
            form.setValue('business', {
                value: business,
                label: business.name,
            });
        }

        if (type) {
            form.setValue('taskType', type);
        }
    }, [route.params]);

    const branch = form.watch('branch')?.value;
    const onSubmit: SubmitHandler<CreateTaskFormValues> = (values) => {
        const branch = values.branch?.value._id ?? null;
        const business = values.business?.value._id ?? null;
        const taskType = values.taskType ?? null;
        const description = values.description ?? null;
        const workOrderNumber = values.workOrderNumber ?? null;
        if (!branch || !business || !taskType || !description || !workOrderNumber) {
            return;
        }

        createTaskMutation.mutate(
            {
                branch,
                business,
                taskType,
                description,
                workOrderNumber,
            },
            {
                onSuccess: () => {
                    navigation.replace('Drawer');
                },
                onError: () => {
                    Toast.show('No se pudo crear la tarea', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                },
            },
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 bg-background relative">
                <KeyboardAwareScrollView className="bg-background flex-1">
                    <View className="px-4 space-y-4 py-4">
                        <Form {...form}>
                            <View className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="branch"
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Sucursal</FormLabel>
                                                <InputFromOuterScreen
                                                    value={field.value}
                                                    placeholder="Selecciona una sucursal"
                                                    onNavigate={() => {
                                                        navigation.navigate(
                                                            'RegisterTaskBranchFieldScreen',
                                                            {
                                                                value:
                                                                    field.value?.value
                                                                        ._id ?? null,
                                                            },
                                                        );
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="business"
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    disabled={!branch}
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                className={cn(!branch && 'opacity-50')}
                                            >
                                                <FormLabel>Empresa</FormLabel>
                                                <InputFromOuterScreen
                                                    value={field.value}
                                                    placeholder="Selecciona una empresa"
                                                    onNavigate={() => {
                                                        if (!branch) return;
                                                        navigation.navigate(
                                                            'RegisterTaskBusinessFieldScreen',
                                                            {
                                                                value:
                                                                    field.value?.value
                                                                        ._id ?? null,
                                                                branchId: branch._id,
                                                            },
                                                        );
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="taskType"
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Tipo de tarea</FormLabel>
                                                <InputFromOuterScreen
                                                    value={
                                                        field.value
                                                            ? {
                                                                  value: field.value,
                                                                  label: field.value,
                                                              }
                                                            : null
                                                    }
                                                    placeholder="Selecciona un tipo de tarea"
                                                    onNavigate={() => {
                                                        navigation.navigate(
                                                            'RegisterTaskTypeFieldScreen',
                                                            {
                                                                value:
                                                                    field.value ?? null,
                                                            },
                                                        );
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Descripción</FormLabel>
                                                <TextInput
                                                    multiline
                                                    onChangeText={field.onChange}
                                                    value={field.value}
                                                    onBlur={field.onBlur}
                                                    placeholder="Descripción"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="workOrderNumber"
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    N° de orden de trabajo
                                                </FormLabel>
                                                <TextInput
                                                    onChangeText={(val) => {
                                                        return field.onChange(
                                                            parseInt(val, 10)
                                                                ? val
                                                                : null,
                                                        );
                                                    }}
                                                    value={field.value?.toString()}
                                                    onBlur={field.onBlur}
                                                    placeholder="N° de orden de trabajo"
                                                    keyboardType="numeric"
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </View>
                        </Form>
                    </View>
                </KeyboardAwareScrollView>

                <View className="absolute bottom-6 inset-x-0 px-4 bg-transparent">
                    {!createTaskMutation.data ? (
                        <Pressable
                            onPress={form.handleSubmit(onSubmit)}
                            className="border border-border p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1 relative"
                        >
                            <Text
                                className={cn(
                                    'font-bold text-white',
                                    createTaskMutation.isPending && 'opacity-0',
                                )}
                            >
                                Crear tarea
                            </Text>

                            {createTaskMutation.isPending && (
                                <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                                    <ActivityIndicator size="small" color="white" />
                                </View>
                            )}
                        </Pressable>
                    ) : (
                        <View className="border border-border p-4 rounded-full bg-white justify-center items-center flex flex-row space-x-1">
                            <Text className="font-bold">Tarea creada</Text>
                            <AntDesign name="checkcircleo" size={16} color="black" />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default RegisterTask;
