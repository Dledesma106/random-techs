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
    DeviceEventEmitter,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';

import RHFDropdown from './Dropdown';

import { ExpenseType, PaySource, expenseTypes, paySources } from '@/models/types';
import { RegisterExpenseOnTaskScreenRouteProp } from '@/navigation/types';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';
import { useCreateExpenseOnTask } from '@/hooks/api/expense/useCreateExpenseOnTask';
import { deletePhoto, stringifyObject, uploadPhoto } from '@/lib/utils';

const EVENT_NAME = 'expense-registered-on-task-event';

export const addRegisterExpenseOnTaskListener = (
    callback: (expense: FormValues) => void,
) => {
    DeviceEventEmitter.addListener(EVENT_NAME, callback);
};

const removeRegisterExpenseOnTaskListener = () => {
    DeviceEventEmitter.removeAllListeners(EVENT_NAME);
};

const emitRegisterExpenseOnTaskEvent = (expense: FormValues) => {
    DeviceEventEmitter.emit(EVENT_NAME, expense);
};
interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}

type FormValues = {
    amount: string;
    paySource: PaySource;
    expenseType: ExpenseType;
    image?: InputImage;
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
            removeRegisterExpenseOnTaskListener();
        };
    }, []);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!data.amount) {
            Toast.show('El monto es requerido', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            return;
        }
        if (!data.expenseType) {
            Toast.show('El tipo de gasto es requerido', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            return;
        }
        if (!data.paySource) {
            Toast.show('La fuente de pago es requerida', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            return;
        }
        if (!data.image) {
            Toast.show('La imagen es requerida', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            return;
        }

        if (!data.image.key) {
            Toast.show('Espere a que la imagen termine de subirse', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
            return;
        }

        emitRegisterExpenseOnTaskEvent(data);
        navigation.goBack();
        reset();
    };

    const deleteImage = async () => {
        const key = watch('image.key');
        await deletePhoto(key);
        setValue('image', undefined);
    };

    const addPictureToExpense = async (uri: string) => {
        setValue('image', { key: '', uri, unsaved: true });
        const key = String(await uploadPhoto(uri));
        setValue('image', { key, uri, unsaved: false });
    };

    const goToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToExpense);
        navigation.navigate('FullScreenCamera');
    };

    const imageURI = watch('image.uri');
    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white">
                <View className="flex flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        className="font-bold"
                    >
                        <View className="rounded bg-black relative flex">
                            <Text className={clsx('font-bold text-white text-xs p-2')}>
                                Registrar gasto
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView className="py-4 flex-1">
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Text>form {stringifyObject(watch())}</Text>
                        </>
                    )}
                    <Text>form {stringifyObject(watch())}</Text>
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
                            label="Fuente de pago"
                        />
                    </View>

                    {watch('image') && (
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-800 font-bold">Imagen</Text>

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('FullScreenImage', {
                                        uri: watch('image.uri') ?? '',
                                    })
                                }
                                className="mx-auto w-8/12"
                            >
                                <Image
                                    className="bg-gray-200 mb-14"
                                    source={{ uri: watch('image.uri') }}
                                    style={{
                                        borderRadius: 6,
                                        aspectRatio: 9 / 16,
                                    }}
                                />
                                {watch('image')?.unsaved && (
                                    <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-white/70">
                                        <ActivityIndicator
                                            className="mb-1"
                                            size="small"
                                            color="black"
                                        />
                                        <Text className="text-xs text-black">
                                            Subiendo...
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                    {watch('image') && (
                        <View className="px-4 pt-4">
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('FullScreenImage', {
                                        uri: watch('image')?.uri ?? '',
                                    })
                                }
                            >
                                <View className="flex-1 relative">
                                    <Image
                                        source={{ uri: watch('image')?.uri }}
                                        style={{
                                            borderRadius: 6,
                                            aspectRatio: 9 / 16,
                                        }}
                                    />
                                    {watch('image')?.unsaved && (
                                        <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center bg-white/70">
                                            <ActivityIndicator
                                                className="mb-1"
                                                size="small"
                                                color="black"
                                            />
                                            <Text className="text-xs text-black">
                                                Subiendo...
                                            </Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={deleteImage}
                                        className="flex flex-row items-center justify-center py-1 absolute rounded-full w-8 h-8 bg-black top-2 right-2"
                                    >
                                        <AntDesign name="close" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!watch('image') && (
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
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default RegisterExpenseOnTask;
