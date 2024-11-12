import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    ExpenseInput,
    ExpensePaySource,
    ExpensePaySourceBank,
    ExpenseType,
} from '@/api/graphql';
import Dropdown from '@/components/ui/Dropdown';
import { useUserContext } from '@/context/userContext/useUser';
import { useGetTechnicians } from '@/hooks/api/useGetTechnicians';
import useImagePicker from '@/hooks/useImagePicker';
import { deletePhoto, stringifyObject, uploadPhoto } from '@/lib/utils';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';

import RHFDropdown from '../ui/RHFDropdown';

interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}

export type ExpenseFormValues = {
    amount: string;
    paySource: ExpensePaySource;
    paySourceBank: ExpensePaySourceBank;
    selectedDoneBy?: string;
    doneBy: string;
    observations: string;
    expenseType: ExpenseType;
    image?: InputImage;
};

interface Props {
    onFinish: (data: ExpenseInput) => Promise<void>;
}

const ExpenseForm = ({ onFinish }: Props) => {
    const { pickImage } = useImagePicker();
    const navigation = useNavigation();
    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExpenseFormValues>();
    const { data: techniciansData, isLoading } = useGetTechnicians();
    const { user } = useUserContext();
    const techniciansOptions = [
        ...(techniciansData?.technicians.map((tech) => {
            return {
                label: tech.fullName,
                value: tech.fullName,
            };
        }) ?? []),
        { label: 'Otro', value: 'Otro' },
    ];
    const paySources = Object.values(ExpensePaySource);
    const paySourceBanks = Object.values(ExpensePaySourceBank);
    const expenseTypes = Object.values(ExpenseType);
    const paySource = watch('paySource');
    const needsBank = ['Debito', 'Credito'].includes(paySource);
    const isOtherTechnician = watch('selectedDoneBy') === 'Otro';

    useEffect(() => {
        setValue('doneBy', user?.fullName ?? '');
        setValue('selectedDoneBy', user?.fullName ?? '');
    }, [user]);
    const onSubmit: SubmitHandler<ExpenseFormValues> = async (data) => {
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
        if (needsBank && !data.paySourceBank) {
            Toast.show('Especifique el banco emisor', {
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

        const parsedAmount = parseFloat(data.amount.replace(',', '.'));

        const expenseData: ExpenseInput = {
            amount: parsedAmount,
            paySource: data.paySource,
            paySourceBank: data.paySourceBank,
            doneBy: data.doneBy,
            observations: data.observations ?? '',
            expenseType: data.expenseType,
            imageKey: data.image.key,
        };
        try {
            await onFinish(expenseData);
            navigation.goBack();
            reset();
        } catch (error) {
            Toast.show(`ocurrio un error: ${error}`, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
            });
        }
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

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToExpense(uri);
    };

    const goToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToExpense);
        navigation.navigate('FullScreenCamera');
    };

    if (isLoading) return <Text>Cargando...</Text>;

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

                <ScrollView className="flex-1 px-4">
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Text>form {stringifyObject(watch())}</Text>
                        </>
                    )}
                    <View className="w-full mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Recorda no tirar el comprobante fisico del gasto
                        </Text>
                        <Text className="mb-2 text-gray-800 font-bold">Monto</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: 'El monto es requerido',
                                pattern: {
                                    value: /^[0-9]+([.,][0-9]{1,2})?$/,
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

                    <View>
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
                        {needsBank && (
                            <RHFDropdown
                                control={control}
                                name="paySourceBank"
                                items={paySourceBanks.map((type) => ({
                                    label: type,
                                    value: type,
                                }))}
                                label="Banco emisor"
                            />
                        )}
                    </View>
                    <Text className="mb-2 text-gray-800 font-bold">Pagado por</Text>
                    <Dropdown
                        items={techniciansOptions}
                        placeholder="Selecciona al comprador"
                        value={watch('selectedDoneBy')}
                        onValueChange={(value) => {
                            setValue('doneBy', value === 'Otro' ? '' : (value ?? ''));
                            setValue('selectedDoneBy', value ?? '');
                        }}
                    />
                    {isOtherTechnician && (
                        <View className="py-4">
                            <Text className="mb-2 text-gray-800 font-bold">
                                Nombre comprador
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Comprador"
                                        className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                                    />
                                )}
                                name="doneBy"
                            />
                        </View>
                    )}
                    <Text className="mb-2 text-gray-800 font-bold">Observaciones</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Observaciones"
                                className="bg-white rounded-lg px-4 py-3 border border-gray-300"
                            />
                        )}
                        name="observations"
                    />

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
                        <>
                            <View className="flex flex-row gap-4 pt-4 px-4">
                                <TouchableOpacity
                                    onPress={goToCameraScreen}
                                    className="flex flex-row justify-center items-center bg-black p-4 rounded-xl space-x-4"
                                >
                                    <Text className="font-semibold text-white">
                                        Sacar foto
                                    </Text>

                                    <EvilIcons name="camera" size={22} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={selectImage}
                                    className="flex flex-row justify-center items-center bg-black p-4 rounded-xl space-x-4"
                                >
                                    <Text className="font-semibold text-white">
                                        Elegir Imagen
                                    </Text>

                                    <EvilIcons name="image" size={22} color="white" />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default ExpenseForm;
