import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import AddImage from '@/components/AddImage';
import ImageThumbnail, { ThumbnailImage } from '@/components/ImageThumbnail';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useGetMyAssignedTaskById } from '@/hooks/api/tasks/useGetMyAssignedTaskById';
import { useUpdateMyAssignedTask } from '@/hooks/api/tasks/useUpdateMyAssignedTask';
import useImagePicker from '@/hooks/useImagePicker';
import { stringifyObject, uploadPhoto, cn, deletePhoto } from '@/lib/utils';
import { PaySource, TaskStatus } from '@/models/types';
import { RegisterTaskScreenRouteProp } from '@/navigation/types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { addFullScreenCameraListener } from '../FullScreenCamera';
import { useEffect, useState } from 'react';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { Image } from 'expo-image';
import ConfirmButton from '@/components/ConfirmButton';
import Toast from 'react-native-root-toast';
import { ExpenseType, TaskType } from '@/api/graphql';
import { addRegisterExpenseOnTaskListener } from '../RegisterExpenseOnTask';
import { addDeleteExpenseOnTaskListener } from '../ExpenseOnTaskForm';
import { addDeleteExpenseByIdListener } from '../Expense';
import { useCreateMyTask } from '@/hooks/api/tasks/useCreateMyTask';
import { useGetClients } from '@/hooks/api/configs/useGetClients';
import { useGetTaskTypes } from '@/hooks/api/configs/useGetTaskTypes';
import { useUserContext } from '@/context/userContext/useUser';
import Dropdown from '@/components/ui/Dropdown';
const MAX_IMAGE_AMOUNT = 5;
interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}

export type ExpenseInput = {
    amount: string;
    paySource: PaySource;
    expenseType: ExpenseType;
    image?: InputImage;
};
interface FormInputs {
    workOrderNumber: string;
    observations: string;
    clientId: string;
    branchId: string;
    businessId: string;
    images: InputImage[];
    expenses: ExpenseInput[];
    closedAt: Date;
    taskType: TaskType;
}

const RegisterTask = ({ navigation }: RegisterTaskScreenRouteProp) => {
    const [fullScreenImage, setFullScreenImage] = useState<ThumbnailImage | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const formMethods = useForm<FormInputs>();
    const userContext = useUserContext();
    const {
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = formMethods;
    const { pickImage } = useImagePicker();
    const { data: clientsData, error, isPending, refetch } = useGetClients();
    const { mutateAsync: createMyTask, isPending: isUpdatePending } = useCreateMyTask();
    const clients = clientsData?.clients;
    const mappedClients =
        clients?.map((client) => ({
            label: client.name,
            value: client.id,
        })) ?? [];
    const selectedClient = watch('clientId')
        ? clients?.find((client) => client.id === watch('clientId'))
        : undefined;
    const mappedBranches =
        selectedClient?.branches.map((branch) => ({
            label: String(branch.number),
            value: branch.id,
        })) ?? [];
    const selectedBranch = watch('branchId')
        ? selectedClient?.branches.find((branch) => branch.id === watch('branchId'))
        : undefined;
    const mappedBusinesses =
        selectedBranch?.businesses.map((business) => ({
            label: business.name,
            value: business.id,
        })) ?? [];
    const taskTypes = Object.values(TaskType);
    const mappedTaskTypes = taskTypes?.map((taskType) => ({
        label: taskType,
        value: taskType,
    }));
    const addPictureToTask = async (uri: string) => {
        const currentImages = watch('images') ?? [];
        setValue('images', [...currentImages, { key: '', uri, unsaved: true }]);
        const key = String(await uploadPhoto(uri));
        setValue('images', [...currentImages, { key, uri, unsaved: false }]);
    };

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToTask(uri);
    };

    const addExpenseToTask = (expense: ExpenseInput) => {
        const currentExpenses = watch('expenses') ?? [];
        setValue('expenses', [...currentExpenses, expense]);
    };

    const removeExpenseOnForm = (expenseImageKey: string) => {
        const currentExpenses = watch('expenses') ?? [];
        setValue(
            'expenses',
            currentExpenses.filter((expense) => expense.image?.key !== expenseImageKey),
        );
    };

    const navigateToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function navigateToRegisterExpense() {
        addRegisterExpenseOnTaskListener(addExpenseToTask);
        navigation.navigate('RegisterExpenseOnTask');
    }

    function navigateToExpenseOnTaskForm(expense: ExpenseInput) {
        addDeleteExpenseOnTaskListener(removeExpenseOnForm);
        navigation.navigate('ExpenseOnTaskForm', { expense });
    }

    const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
        const {
            workOrderNumber,
            images,
            observations,
            closedAt,
            expenses,
            branchId,
            businessId,
            taskType,
        } = formData;
        const formatedExpenses = expenses?.map((expense) => ({
            amount: parseInt(expense.amount),
            paySource: expense.paySource,
            expenseType: expense.expenseType,
            imageKey: expense.image?.key ?? '',
        }));
        const { user } = userContext;
        const imageKeys = images ? images.map((image) => image.key) : [];
        try {
            await createMyTask({
                input: {
                    branch: branchId,
                    business: businessId,
                    assigned: [user?.id ?? ''],
                    taskType,
                    observations,
                    workOrderNumber,
                    imageKeys,
                    closedAt,
                    expenses: formatedExpenses,
                },
            });
        } catch (error) {}
        reset();
    };

    const handleDeleteImage = async (image: ThumbnailImage) => {
        if (image.key) {
            try {
                const currentImages = watch('images');
                const filteredImages = currentImages.filter(
                    (thisImage) => thisImage.key !== image.key,
                );
                setValue('images', filteredImages);
                await deletePhoto(image.key);
                Toast.show('Imagen eliminada', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                });
            } catch (error) {
                Toast.show('Error al eliminar imagen', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                });
            }
        }
        setFullScreenImage(null);
        return;
    };

    if (fullScreenImage) {
        return (
            <View className="flex-1 relative">
                <Zoomable>
                    <Image
                        className="flex-1"
                        source={{ uri: fullScreenImage.url ?? fullScreenImage.uri }}
                    />
                </Zoomable>
                <View className="absolute top-2 right-2 bg-black flex items-center justify-center rounded-full z-50 w-8 h-8 opacity-0.5">
                    <TouchableOpacity onPress={() => setFullScreenImage(null)}>
                        <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <ConfirmButton
                    onConfirm={() => handleDeleteImage(fullScreenImage)}
                    title="Eliminar foto"
                    confirmMessage="¿Seguro que quiere eliminar la foto?"
                    icon={<EvilIcons name="trash" size={22} color="white" />}
                />
            </View>
        );
    }
    if (clients && Array.isArray(clients)) {
        const imagesAmount = watch('images')?.length ?? 0;
        const isFormDirty =
            isDirty ||
            watch('images')?.length > 0 ||
            watch('expenses')?.length > 0 ||
            String(new Date(watch('closedAt')));
        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    className="flex-1"
                    refreshControl={
                        <RefreshControl refreshing={isPending} onRefresh={refetch} />
                    }
                >
                    {process.env.EXPO_PUBLIC_ENVIRONMENT === 'development' && (
                        <>
                            <Text>form: {stringifyObject(watch())} </Text>
                        </>
                    )}
                    <View className="px-4 pt-4 pb-24 space-y-4">
                        <View>
                            <Label className="mb-1.5">Cliente</Label>
                            <Dropdown
                                items={mappedClients}
                                placeholder="Selecciona un cliente"
                                onValueChange={(value) =>
                                    setValue('clientId', value ?? '')
                                }
                            />
                        </View>
                        <View>
                            <Label className="mb-1.5">Sucursal</Label>
                            <Dropdown
                                items={mappedBranches}
                                placeholder="Selecciona una sucursal"
                                onValueChange={(value) =>
                                    setValue('branchId', value ?? '')
                                }
                            />
                        </View>
                        <View>
                            <Label className="mb-1.5">Empresa</Label>
                            <Dropdown
                                items={mappedBusinesses}
                                placeholder="Selecciona una empresa"
                                onValueChange={(value) =>
                                    setValue('businessId', value ?? '')
                                }
                            />
                        </View>

                        <View>
                            <Label className="mb-1.5">Tipo de tarea</Label>
                            <Dropdown
                                items={mappedBranches}
                                placeholder="Selecciona el tipo de tarea"
                                onValueChange={(value) =>
                                    setValue('taskType', value as TaskType)
                                }
                            />
                        </View>

                        <View>
                            <Label className="mb-1.5">Fecha de cierre</Label>

                            <View>
                                <TouchableOpacity
                                    onPress={() => setDatePickerVisibility(true)}
                                >
                                    <TextInput
                                        inputStyle={{ color: 'black' }}
                                        editable={false}
                                        icon={<EvilIcons name="calendar" size={24} />}
                                    >
                                        {watch('closedAt')
                                            ? format(
                                                  new Date(watch('closedAt')),
                                                  'dd/MM/yyyy',
                                              )
                                            : 'Fecha de cierre'}
                                    </TextInput>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(date) => {
                                        setValue('closedAt', date);
                                        setDatePickerVisibility(false);
                                    }}
                                    onCancel={() => setDatePickerVisibility(false)}
                                    date={watch('closedAt') || new Date()}
                                />
                            </View>
                        </View>
                        <View>
                            <Label className="mb-1.5">Orden de Trabajo</Label>

                            <Form {...formMethods}>
                                <FormField
                                    name="workOrderNumber"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(val) => {
                                                onChange(val);
                                            }}
                                            value={value?.toString()}
                                            placeholder="Orden de Trabajo"
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </Form>
                        </View>

                        <View>
                            <Label className="mb-1.5">Observaciones</Label>
                            <Form {...formMethods}>
                                <FormField
                                    name="observations"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(val) => {
                                                onChange(val);
                                            }}
                                            value={String(value)}
                                            placeholder="Observaciones"
                                        />
                                    )}
                                />
                            </Form>
                        </View>

                        <View className="items-start">
                            <Label className="mb-1.5">Gastos</Label>

                            <View className="space-y-2 w-full">
                                {watch('expenses') &&
                                    watch('expenses').map((expense) => (
                                        <Button
                                            key={expense.image?.key}
                                            onPress={() =>
                                                navigateToExpenseOnTaskForm(expense)
                                            }
                                            className="flex flex-row items-center justify-between"
                                            variant="outline"
                                        >
                                            <ButtonText>
                                                {expense.expenseType} - $
                                                {Number(expense.amount).toLocaleString(
                                                    'es-AR',
                                                )}
                                            </ButtonText>

                                            <AntDesign
                                                name="right"
                                                size={14}
                                                color="gray"
                                            />
                                        </Button>
                                    ))}
                            </View>

                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onPress={navigateToRegisterExpense}
                            >
                                <ButtonText>Agregar gasto</ButtonText>
                            </Button>
                        </View>

                        <View>
                            <Label className="mb-1.5">
                                Imágenes de comprobante de trabajo({imagesAmount} de{' '}
                                {MAX_IMAGE_AMOUNT})
                            </Label>

                            <View className="flex flex-row space-x-4">
                                {watch('images')?.map((image) => (
                                    <ImageThumbnail
                                        key={image.key}
                                        image={image}
                                        onImagePress={() => setFullScreenImage(image)}
                                    />
                                ))}

                                {imagesAmount < MAX_IMAGE_AMOUNT && (
                                    <AddImage
                                        navigateToCameraScreen={navigateToCameraScreen}
                                        selectImage={selectImage}
                                        maxImageAmount={MAX_IMAGE_AMOUNT}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="absolute bottom-4 inset-x-0 px-4 bg-transparent">
                    {isFormDirty && (
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            className="p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1 relative"
                        >
                            <Text
                                className={cn(
                                    'font-bold text-white',
                                    isUpdatePending && 'opacity-0',
                                )}
                            >
                                Enviar tarea
                            </Text>

                            {isUpdatePending && (
                                <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                                    <ActivityIndicator size="small" color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={isPending} onRefresh={refetch} />
                    }
                    className="flex-1 bg-white"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <View className="flex-1 flex items-center justify-center">
                        <Text className="text-center text-muted-foreground">
                            No se pudieron cargar las configuraciones
                        </Text>
                        <Text className="text-center text-muted-foreground">
                            Por favor, intente nuevamente
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View className="bg-white flex-1 px-4 py-4">
            <ContentLoader>
                <Rect x="0" y="0" rx="10" ry="10" width="100" height="18" />
                <Rect x="0" y="24" rx="10" ry="10" width="388" height="32" />
                <Rect x="0" y="80" rx="10" ry="10" width="388" height="32" />
                <Rect x="0" y="120" rx="10" ry="10" width="388" height="32" />
                <Rect x="0" y="160" rx="10" ry="10" width="388" height="32" />
            </ContentLoader>
        </View>
    );
};

export default RegisterTask;
