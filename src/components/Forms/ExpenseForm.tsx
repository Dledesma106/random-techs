import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { format } from 'date-fns';
import Constants from 'expo-constants';
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
import AddImage from '@/components/AddImage';
import FileViewer from '@/components/FileViewer';
import ImageThumbnail from '@/components/ImageThumbnail';
import { Button, ButtonText } from '@/components/ui/button';
import Dropdown from '@/components/ui/Dropdown';
import { TextInput } from '@/components/ui/Input';
import { useUserContext } from '@/context/userContext/useUser';
import { useGetTechnicians } from '@/hooks/api/useGetTechnicians';
import useImagePicker from '@/hooks/useImagePicker';
import { showToast } from '@/lib/toast';
import { deletePhoto, getFileSignedUrl, stringifyObject, uploadPhoto } from '@/lib/utils';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';

import CollapsableText from '../CollapsableText';
import RHFDropdown from '../ui/RHFDropdown';

const MAX_IMAGE_AMOUNT = 5;

const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';

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
    images?: InputImage[];
    files?: InputFile[];
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
    const [fileViewerUrls, setFileViewerUrls] = useState<{ [key: string]: string }>({});
    const [fullScreenImage, setFullScreenImage] = useState<InputImage | null>(null);

    useEffect(() => {
        setValue('doneBy', user?.fullName ?? '');
        setValue('selectedDoneBy', user?.fullName ?? '');
    }, [user]);

    useEffect(() => {
        const files = watch('files');
        if (files && files.length > 0) {
            getFileUrls();
        }
    }, [watch('files')]);

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
        if (!data.images?.length && !data.files?.length) {
            showToast('Debe incluir al menos una imagen o un archivo', 'error');
            return;
        }

        const imagesUnsaved = data.images?.some((img) => !img.key || img.unsaved);
        const filesUnsaved = data.files?.some((file) => !file.key || file.unsaved);

        if (imagesUnsaved || filesUnsaved) {
            showToast('Espere a que todos los archivos terminen de subirse', 'error');
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
            imageKeys: data.images?.map((img) => img.key) ?? [],
            fileKeys: data.files?.map((file) => file.key) ?? [],
            filenames: data.files?.map((file) => file.name) ?? [],
            mimeTypes: data.files?.map((file) => file.mimeType) ?? [],
            sizes: data.files?.map((file) => file.size) ?? [],
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

    const deleteImage = async (imageToDelete: InputImage) => {
        const images = watch('images') || [];
        await deletePhoto(imageToDelete.key);
        setValue(
            'images',
            images.filter((img) => img.key !== imageToDelete.key),
            { shouldValidate: true },
        );
    };

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToExpense(uri);
    };

    const getFileUrls = async () => {
        const files = watch('files') || [];
        const urls: { [key: string]: string } = {};

        for (const file of files) {
            if (file.key) {
                const result = await getFileSignedUrl(file.key, file.mimeType);
                urls[file.key] = result.url;
            }
        }

        setFileViewerUrls(urls);
    };

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
                const currentFiles = watch('files') || [];

                setValue('files', [
                    ...currentFiles,
                    {
                        key: '',
                        uri,
                        unsaved: true,
                        name,
                        mimeType: mimeType ?? '',
                        size: size ?? 0,
                    },
                ]);

                const key = String(await uploadPhoto(uri));

                setValue('files', [
                    ...currentFiles,
                    {
                        key,
                        uri,
                        unsaved: false,
                        name,
                        mimeType: mimeType ?? '',
                        size: size ?? 0,
                    },
                ]);
            }
        } catch (err) {
            showToast('Error al seleccionar el archivo', 'error');
        }
    };

    const deleteFile = async (fileToDelete: InputFile) => {
        const files = watch('files') || [];
        await deletePhoto(fileToDelete.key);
        setValue(
            'files',
            files.filter((file) => file.key !== fileToDelete.key),
            { shouldValidate: true },
        );
    };

    const addPictureToExpense = async (uri: string) => {
        const currentImages = watch('images') || [];
        setValue('images', [...currentImages, { key: '', uri, unsaved: true }]);
        const key = String(await uploadPhoto(uri));
        setValue('images', [...currentImages, { key, uri, unsaved: false }]);
    };

    const imagesAmount = watch('images')?.length || 0;
    const filesAmount = watch('files')?.length || 0;

    if (fullScreenImage) {
        return (
            <View className="flex-1 relative">
                <Image source={{ uri: fullScreenImage.uri }} style={{ flex: 1 }} />
                <TouchableOpacity
                    onPress={() => setFullScreenImage(null)}
                    className="absolute top-4 right-4 bg-black rounded-full p-2"
                >
                    <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        deleteImage(fullScreenImage);
                        setFullScreenImage(null);
                    }}
                    className="absolute bottom-4 right-4 bg-red-500 rounded-full p-3"
                >
                    <EvilIcons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

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
                    {isDevelopment && (
                        <>
                            <CollapsableText
                                buttonText="datos de formulario"
                                text={stringifyObject(watch())}
                            />
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

                    <View>
                        <Text className="mb-2 text-gray-800 font-bold">
                            Imágenes de comprobante ({imagesAmount} de {MAX_IMAGE_AMOUNT})
                        </Text>

                        <View className="flex flex-row flex-wrap space-x-4 mb-4">
                            {watch('images')?.map((image) => (
                                <ImageThumbnail
                                    key={image.key || image.uri}
                                    image={image}
                                    onImagePress={() => setFullScreenImage(image)}
                                />
                            ))}

                            {imagesAmount < MAX_IMAGE_AMOUNT && (
                                <AddImage
                                    navigateToCameraScreen={goToCameraScreen}
                                    selectImage={selectImage}
                                    maxImageAmount={MAX_IMAGE_AMOUNT}
                                />
                            )}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-gray-800 font-bold">
                            Archivos adjuntos ({filesAmount})
                        </Text>

                        <View className="space-y-2 w-full">
                            {watch('files')?.map((file) => (
                                <View
                                    key={file.key || file.uri}
                                    className="flex-row items-center justify-between bg-background rounded-md mb-2"
                                >
                                    {file.unsaved ? (
                                        <ActivityIndicator size="small" color="black" />
                                    ) : (
                                        <FileViewer
                                            url={fileViewerUrls[file.key]}
                                            name={file.name}
                                            size={file.size}
                                            onDelete={() => deleteFile(file)}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>

                        <View className="mt-3">
                            <Button variant="outline" size="sm" onPress={selectFile}>
                                <ButtonText>Agregar archivo</ButtonText>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default ExpenseForm;
