import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { format } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    ExpenseInput,
    ExpensePaySource,
    ExpensePaySourceBank,
    ExpenseType,
} from '@/api/graphql';
import FileViewer from '@/components/FileViewer';
import Dropdown from '@/components/ui/Dropdown';
import { TextInput } from '@/components/ui/Input';
import { useUserContext } from '@/context/userContext/useUser';
import { useGetTechnicians } from '@/hooks/api/useGetTechnicians';
import useImagePicker from '@/hooks/useImagePicker';
import { showToast } from '@/lib/toast';
import { deletePhoto, getFileSignedUrl, stringifyObject, uploadPhoto } from '@/lib/utils';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';

import RHFDropdown from '../ui/RHFDropdown';

interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}

interface InputFile {
    key: string;
    uri: string;
    unsaved: boolean;
    name: string;
    mimeType: string;
    size: number;
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
    file?: InputFile;
    installments?: number;
    expenseDate: Date;
    cityName: string;
    selectedCity?: string;
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
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
    const cityOptions = [
        { label: 'Trelew', value: 'Trelew' },
        { label: 'Rawson', value: 'Rawson' },
        { label: 'Esquel', value: 'Esquel' },
        { label: 'Madryn', value: 'Madryn' },
        { label: 'Comodoro', value: 'Comodoro' },
        { label: 'Otro', value: 'Otro' },
    ];
    const isOtherCity = watch('selectedCity') === 'Otro';
    const [fileViewerUrl, setFileViewerUrl] = useState<string>('');

    useEffect(() => {
        setValue('doneBy', user?.fullName ?? '');
        setValue('selectedDoneBy', user?.fullName ?? '');
    }, [user]);

    useEffect(() => {
        if (watch('file')) {
            getFileUrl().then((url) => setFileViewerUrl(url.url));
        }
    }, [watch('file')]);

    const onSubmit: SubmitHandler<ExpenseFormValues> = async (data) => {
        if (!data.amount) {
            showToast('El monto es requerido', 'error');
            return;
        }
        if (!data.expenseType) {
            showToast('El tipo de gasto es requerido', 'error');
            return;
        }
        if (!data.paySource) {
            showToast('La fuente de pago es requerida', 'error');
            return;
        }
        if (needsBank && !data.paySourceBank) {
            showToast('Especifique el banco emisor', 'error');
            return;
        }
        if (!data.image && !data.file) {
            showToast('Debe incluir una imagen o un archivo', 'error');
            return;
        }

        if (data.image && data.file) {
            showToast('Solo puede incluir una imagen o un archivo, no ambos', 'error');
            return;
        }

        if ((data.image && !data.image.key) || (data.file && !data.file.key)) {
            showToast('Espere a que el archivo termine de subirse', 'error');
            return;
        }

        if (!data.expenseDate) {
            showToast('Especifique la fecha de compra', 'error');
            return;
        }

        const parsedAmount = parseFloat(data.amount.replace(',', '.'));

        const expenseData: ExpenseInput = {
            amount: parsedAmount,
            paySource: data.paySource,
            installments: Number(data.installments ?? 1),
            expenseDate: data.expenseDate,
            paySourceBank: data.paySourceBank,
            doneBy: data.doneBy,
            observations: data.observations ?? '',
            expenseType: data.expenseType,
            imageKey: data.image?.key ?? null,
            fileKey: data.file?.key ?? null,
            filename: data.file?.name ?? null,
            mimeType: data.file?.mimeType ?? null,
            size: data.file?.size ?? null,
            cityName: data.cityName,
        };
        try {
            await onFinish(expenseData);
            navigation.goBack();
            reset();
        } catch (error) {
            showToast(`ocurrio un error: ${error}`, 'error');
        }
    };

    const deleteImage = async () => {
        const key = watch('image.key');
        await deletePhoto(key);
        setValue('image', undefined);
    };

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToExpense(uri);
    };

    const getFileUrl = async () =>
        await getFileSignedUrl(watch('file')?.key ?? '', watch('file')?.mimeType ?? '');

    const goToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToExpense);
        navigation.navigate('FullScreenCamera');
    };

    const selectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
            });

            if (result.assets?.[0]) {
                const { uri, name, size, mimeType } = result.assets[0];
                setValue('file', {
                    key: '',
                    uri,
                    unsaved: true,
                    name,
                    mimeType: mimeType ?? '',
                    size: size ?? 0,
                });
                const key = String(await uploadPhoto(uri));

                setValue('file', {
                    key,
                    uri,
                    unsaved: false,
                    name,
                    mimeType: mimeType ?? '',
                    size: size ?? 0,
                });
                // Limpiar imagen si existe

                setValue('image', undefined);
            }
        } catch (err) {
            showToast('Error al seleccionar el archivo', 'error');
        }
    };

    const deleteFile = async () => {
        const key = watch('file.key');
        await deletePhoto(key);
        setValue('file', undefined);
    };

    // Modificar addPictureToExpense para limpiar archivo si existe
    const addPictureToExpense = async (uri: string) => {
        setValue('image', { key: '', uri, unsaved: true });
        const key = String(await uploadPhoto(uri));
        setValue('image', { key, uri, unsaved: false });
        // Limpiar archivo si existe
        setValue('file', undefined);
    };

    if (isLoading) return <Text>Cargando...</Text>;

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white pb-4">
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
                    {watch('paySource') === 'Credito' && (
                        <View className="py-2">
                            <Text className="mb-2 text-gray-800 font-bold">
                                Cantidad de cuotas
                            </Text>
                            <Controller
                                name="installments"
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={String(value ?? 1)}
                                        placeholder="Cuotas"
                                        keyboardType="numeric"
                                    />
                                )}
                            />
                        </View>
                    )}
                    <View className="py-2">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Fecha del gasto
                        </Text>

                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                            <TextInput
                                inputStyle={{ color: 'black' }}
                                editable={false}
                                icon={<EvilIcons name="calendar" size={24} />}
                            >
                                {watch('expenseDate')
                                    ? format(new Date(watch('expenseDate')), 'dd/MM/yyyy')
                                    : 'Fecha del gasto'}
                            </TextInput>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) => {
                                setValue('expenseDate', date);
                                setDatePickerVisibility(false);
                            }}
                            onCancel={() => setDatePickerVisibility(false)}
                            date={watch('expenseDate') || new Date()}
                            maximumDate={new Date()}
                        />
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
                                    />
                                )}
                                name="doneBy"
                            />
                        </View>
                    )}
                    <View>
                        <Text className="mb-2 text-gray-800 font-bold">
                            Ciudad donde se registra el gasto
                        </Text>
                        <Dropdown
                            items={cityOptions}
                            placeholder="Selecciona la ciudad"
                            value={watch('selectedCity')}
                            onValueChange={(value) => {
                                setValue(
                                    'cityName',
                                    value === 'Otros' ? '' : (value ?? ''),
                                );
                                setValue('selectedCity', value ?? '');
                            }}
                        />
                        {isOtherCity && (
                            <View className="py-4">
                                <Text className="mb-2 text-gray-800 font-bold">
                                    Nombre de la ciudad
                                </Text>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Ciudad"
                                        />
                                    )}
                                    name="cityName"
                                />
                            </View>
                        )}
                    </View>
                    <Text className="mb-2 text-gray-800 font-bold">Observaciones</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                onBlur={onBlur}
                                multiline
                                onChangeText={onChange}
                                value={value}
                                placeholder="Observaciones"
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

                    {!watch('image') && !watch('file') && (
                        <View className="flex flex-col gap-4 p-4">
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
                            <TouchableOpacity
                                onPress={selectFile}
                                className="flex flex-row justify-center items-center bg-black p-4 rounded-xl space-x-4"
                            >
                                <Text className="font-semibold text-white">
                                    Elegir Archivo
                                </Text>
                                <EvilIcons name="paperclip" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {watch('file') && (
                        <FileViewer
                            url={fileViewerUrl}
                            name={watch('file')?.name ?? ''}
                            size={watch('file')?.size}
                            isUploading={watch('file')?.unsaved}
                            onDelete={deleteFile}
                        />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default ExpenseForm;
