import { AntDesign, EvilIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    Pressable,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';

import RHFDropdown from './Dropdown';
import { useCreateTaskExpenseMutation } from './mutations';

import { ExpenseType, PaySource, expenseTypes, paySources } from '@/models/types';
import { RegisterExpenseOnTaskScreenRouteProp } from '@/navigation/types';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';

type FormValues = {
    amount: string;
    paySource: PaySource;
    expenseType: ExpenseType;
    imageURI?: string;
};

const RegisterExpenseOnTask = ({
    route,
    navigation,
}: RegisterExpenseOnTaskScreenRouteProp) => {
    const { taskId } = route.params;

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();

    useEffect(() => {
        return () => {
            reset();
        };
    }, [taskId]);

    const createExpenseMutation = useCreateTaskExpenseMutation();

    const createExpense: SubmitHandler<FormValues> = (data) => {
        if (!data.imageURI) {
            Toast.show('La imagen es requerida', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });

            return;
        }

        createExpenseMutation.mutate(
            {
                taskId,
                amount: parseFloat(data.amount),
                paySource: data.paySource,
                expenseType: data.expenseType,
                imageURI: data.imageURI,
            },
            {
                onSuccess: () => {
                    Toast.show('Gasto registrado', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                    });

                    navigation.goBack();
                },
                onError: (error) => {
                    Toast.show(`Ocurrió un error: ${error}`, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                    });
                },
            },
        );
    };

    const goToCameraScreen = () => {
        addFullScreenCameraListener((uri) => {
            setValue('imageURI', uri);
        });
        navigation.navigate('FullScreenCamera');
    };

    const imageURI = watch('imageURI');

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white">
                <View className="flex flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                    <TouchableOpacity
                        className={clsx(createExpenseMutation.isPending && 'opacity-30')}
                        disabled={createExpenseMutation.isPending}
                        onPress={() => navigation.goBack()}
                    >
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit(createExpense)}
                        className="font-bold"
                    >
                        <View className="rounded bg-black relative flex">
                            <Text
                                className={clsx(
                                    'font-bold text-white text-xs p-2',
                                    createExpenseMutation.isPending && 'opacity-0',
                                )}
                            >
                                Registrar gasto
                            </Text>

                            {createExpenseMutation.isPending && (
                                <View className="absolute inset-0 w-full h-full flex items-center justify-center flex-1">
                                    <ActivityIndicator size="small" color="#FFF" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView className="py-4 flex-1">
                    <View className="w-full mb-4 px-4">
                        <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: 'El monto es requerido',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'El monto no es válido',
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="number-pad"
                                    placeholder="Monto"
                                    className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                                />
                            )}
                            name="amount"
                        />
                        {errors.amount && (
                            <Text className="text-red-500 mt-1">
                                {errors.amount.message}
                            </Text>
                        )}
                    </View>

                    <View className="px-4">
                        <RHFDropdown
                            control={control}
                            name="expenseType"
                            items={expenseTypes.map((type) => ({
                                label: type,
                                value: type,
                            }))}
                            label="Tipo de gasto"
                        />

                        <RHFDropdown
                            control={control}
                            name="paySource"
                            items={paySources.map((type) => ({
                                label: type,
                                value: type,
                            }))}
                            label="Tipo de pago"
                        />
                    </View>

                    {imageURI && (
                        <View className="px-4 pt-4">
                            <Pressable
                                onPress={() => setValue('imageURI', undefined)}
                                className="flex flex-row items-center justify-between py-1"
                            >
                                <Text className="text-gray-600">Imagen</Text>
                                <AntDesign name="close" size={14} color="gray" />
                            </Pressable>

                            <View className="flex-1">
                                <Image
                                    source={{ uri: imageURI }}
                                    style={{
                                        borderRadius: 6,
                                        aspectRatio: 9 / 16,
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    <View className="pt-8 px-4">
                        <TouchableOpacity
                            onPress={goToCameraScreen}
                            className="flex flex-row justify-center items-center bg-black p-4 rounded-xl space-x-4"
                        >
                            <Text className="font-semibold text-white">
                                Añadir Imagen
                            </Text>

                            <EvilIcons name="camera" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default RegisterExpenseOnTask;
