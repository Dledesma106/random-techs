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

import AddImage from './AddImage';
import ImageThumbnail, { ThumbnailImage } from './ImageThumbnail';

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
import { TaskScreenRouteProp } from '@/navigation/types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { addFullScreenCameraListener } from '../FullScreenCamera';
import { useEffect, useState } from 'react';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { Image } from 'expo-image';
import ConfirmButton from '@/components/ConfirmButton';
import { useDeleteImageById } from '@/hooks/api/tasks/useDeleteImageById';
import Toast from 'react-native-root-toast';
import { ExpenseType } from '@/api/graphql';
import { addRegisterExpenseOnTaskListener } from '../RegisterExpenseOnTask';
import { addDeleteExpenseOnTaskListener } from '../ExpenseOnTaskForm';
import { addDeleteExpenseByIdListener } from '../ExpenseOnTask';
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
    images: InputImage[];
    expenses: ExpenseInput[];
    imageIdsToDelete: string[];
    expenseIdsToDelete: string[];
    closedAt: Date;
}

const Task = ({ route, navigation }: TaskScreenRouteProp) => {
    const { id } = route.params;
    const { data, isPending, refetch, error } = useGetMyAssignedTaskById(id);
    const [fullScreenImage, setFullScreenImage] = useState<ThumbnailImage | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const formMethods = useForm<FormInputs>();
    const {
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = formMethods;
    const { pickImage } = useImagePicker();
    const { mutateAsync: deleteImage } = useDeleteImageById();
    const { mutateAsync: updateTask, isPending: isUpdatePending } =
        useUpdateMyAssignedTask();

    useEffect(() => {
        const task = data?.myAssignedTaskById;
        if (!task) return;
        reset({
            workOrderNumber: task.workOrderNumber ? String(task.workOrderNumber) : '',
            observations: task.observations ?? '',
            closedAt: task.closedAt ? new Date(task.closedAt) : undefined,
            images: undefined,
            expenses: undefined,
        });
    }, [data]);

    const addPictureToTask = async (uri: string) => {
        const currentImages = watch('images') ?? [];
        setValue('images', [...currentImages, { key: '', uri, unsaved: true }]);
        const key = String(await uploadPhoto(uri));
        setValue('images', [...currentImages, { key, uri, unsaved: false }]);
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

    const deleteExpenseById = (expenseId: string) => {
        const currentExpenseIdsToDelete = watch('expenseIdsToDelete') ?? [];
        setValue('expenseIdsToDelete', [...currentExpenseIdsToDelete, expenseId]);
    };

    const deleteImageById = (imageId: string) => {
        const currentImageIdsToDelete = watch('imageIdsToDelete') ?? [];
        setValue('imageIdsToDelete', [...currentImageIdsToDelete, imageId]);
    };

    const navigateToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function navigateToRegisterExpense() {
        addRegisterExpenseOnTaskListener(addExpenseToTask);
        navigation.navigate('RegisterExpenseOnTask', { taskId: id });
    }

    function navigateToExpense(expenseId: string) {
        addDeleteExpenseByIdListener(deleteExpenseById);
        navigation.navigate('ExpenseOnTask', { expenseId, taskId: id });
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
            imageIdsToDelete,
            expenseIdsToDelete,
        } = formData;
        const formatedExpenses = expenses?.map((expense) => ({
            amount: parseInt(expense.amount),
            paySource: expense.paySource,
            expenseType: expense.expenseType,
            imageKey: expense.image?.key ?? '',
        }));
        console.log('expenses for input: ', formatedExpenses);
        const imageKeys = images ? images.map((image) => image.key) : [];
        try {
            await updateTask({
                input: {
                    observations,
                    id,
                    workOrderNumber,
                    imageKeys,
                    closedAt,
                    expenses: formatedExpenses,
                    imageIdsToDelete,
                    expenseIdsToDelete,
                },
            });
        } catch (error) {}
        reset();
    };

    const handleDeleteImage = async (image: ThumbnailImage) => {
        if (image.id) deleteImageById(image.id);
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

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToTask(uri);
    };

    if (fullScreenImage)
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

    if (data && !Array.isArray(data)) {
        const task = data.myAssignedTaskById;

        if (!task) {
            return (
                <View className="flex-1">
                    <Text>No se encontró la tarea</Text>
                </View>
            );
        }

        const imagesAmount =
            (task.images.length ?? 0) -
            (watch('imageIdsToDelete')?.length ?? 0) +
            (watch('images')?.length ?? 0);
        const isFormDirty =
            isDirty ||
            watch('images')?.length > 0 ||
            watch('expenses')?.length > 0 ||
            watch('expenseIdsToDelete')?.length > 0 ||
            watch('imageIdsToDelete')?.length > 0 ||
            String(new Date(watch('closedAt'))) !== String(new Date(task.closedAt));
        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={isPending} onRefresh={refetch} />
                    }
                    className="flex-1"
                >
                    {process.env.EXPO_PUBLIC_ENVIRONMENT === 'development' && (
                        <>
                            <Text>{stringifyObject(task)}</Text>
                            <Text>form: {stringifyObject(watch())} </Text>
                        </>
                    )}
                    <View className="px-4 pt-4 pb-24 space-y-4">
                        <View className="items-start">
                            <Badge className="mb-4">
                                <BadgeText>{task.taskType}</BadgeText>
                            </Badge>

                            <Text className="text-muted-foreground">
                                {task.business.name}
                            </Text>

                            <Text className="text-xl font-bold">
                                {task.branch.client.name}
                            </Text>
                        </View>

                        <View>
                            <Label>Sucursal</Label>
                            <Text className="text-muted-foreground">
                                {task.branch.number}
                            </Text>
                        </View>

                        <View>
                            <Label className="mb-1.5">Fecha de asignación</Label>
                            <Text className="text-muted-foreground">
                                {task.createdAt
                                    ? format(new Date(task.createdAt), 'dd/MM/yyyy')
                                    : 'N/A'}
                            </Text>
                        </View>

                        <View>
                            <Label className="mb-1.5">Descripción</Label>
                            <Text className="text-muted-foreground">
                                {task.description}
                            </Text>
                        </View>

                        <View>
                            <Label className="mb-1.5">Auditor</Label>
                            <Text className="text-muted-foreground">
                                {task.auditor ? task.auditor.fullName : 'Pendiente'}
                            </Text>
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
                                            : task.closedAt
                                              ? format(
                                                    new Date(task.closedAt),
                                                    'dd/MM/yyyy',
                                                )
                                              : 'Pendiente'}
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
                            {task.status !== TaskStatus.Aprobada ? (
                                <Form {...formMethods}>
                                    <FormField
                                        name="workOrderNumber"
                                        control={control}
                                        defaultValue={String(task.workOrderNumber ?? '')}
                                        render={({
                                            field: { onChange, onBlur, value },
                                        }) => (
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={(val) => {
                                                    onChange(val);
                                                }}
                                                value={value?.toString()}
                                                placeholder={String(
                                                    task.workOrderNumber ??
                                                        'Orden de Trabajo',
                                                )}
                                                keyboardType="numeric"
                                            />
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.workOrderNumber || 'No especificado'}
                                </Text>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">Observaciones</Label>
                            {task.status !== TaskStatus.Aprobada ? (
                                <Form {...formMethods}>
                                    <FormField
                                        name="observations"
                                        control={control}
                                        defaultValue={String(task.observations ?? '')}
                                        render={({
                                            field: { onChange, onBlur, value },
                                        }) => (
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={(val) => {
                                                    onChange(val);
                                                }}
                                                value={String(value)}
                                                placeholder={
                                                    task.observations ?? 'Observaciones'
                                                }
                                            />
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.workOrderNumber || 'No especificado'}
                                </Text>
                            )}
                        </View>

                        <View className="items-start">
                            <Label className="mb-1.5">Gastos</Label>

                            <View className="space-y-2 w-full">
                                {task.expenses
                                    .filter(
                                        (expense) =>
                                            !watch('expenseIdsToDelete')?.includes(
                                                expense.id,
                                            ),
                                    )
                                    .map((expense) => (
                                        <Button
                                            key={expense.id}
                                            onPress={() => navigateToExpense(expense.id)}
                                            className="flex flex-row items-center justify-between"
                                            variant="outline"
                                        >
                                            <ButtonText>
                                                {expense.expenseType} - ${expense.amount}
                                            </ButtonText>

                                            <AntDesign
                                                name="right"
                                                size={14}
                                                color="gray"
                                            />
                                        </Button>
                                    ))}

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
                                                {expense.expenseType} - ${expense.amount}
                                            </ButtonText>

                                            <AntDesign
                                                name="right"
                                                size={14}
                                                color="gray"
                                            />
                                        </Button>
                                    ))}

                                {task.expenses.length === 0 &&
                                    task.status === TaskStatus.Aprobada && (
                                        <Text className="text-muted-foreground">
                                            No hay gastos registrados
                                        </Text>
                                    )}
                            </View>

                            {task.status !== TaskStatus.Aprobada && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onPress={navigateToRegisterExpense}
                                >
                                    <ButtonText>Agregar gasto</ButtonText>
                                </Button>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">
                                Imágenes ({imagesAmount} de {MAX_IMAGE_AMOUNT})
                            </Label>

                            <View className="flex flex-row space-x-4">
                                {task.images
                                    .filter(
                                        (image) =>
                                            !watch('imageIdsToDelete')?.includes(
                                                image.id,
                                            ),
                                    )
                                    .map((image) => (
                                        <ImageThumbnail
                                            key={image.id}
                                            image={image}
                                            onImagePress={() => setFullScreenImage(image)}
                                        />
                                    ))}

                                {watch('images')?.map((image) => (
                                    <ImageThumbnail
                                        key={image.key}
                                        image={image}
                                        onImagePress={() => setFullScreenImage(image)}
                                    />
                                ))}

                                {imagesAmount === 0 &&
                                    task.status === TaskStatus.Aprobada && (
                                        <Text className="text-muted-foreground">
                                            No hay imágenes registradas
                                        </Text>
                                    )}

                                {task.status !== TaskStatus.Aprobada &&
                                    imagesAmount < MAX_IMAGE_AMOUNT && (
                                        <AddImage
                                            navigateToCameraScreen={
                                                navigateToCameraScreen
                                            }
                                            selectImage={selectImage}
                                            maxImageAmount={MAX_IMAGE_AMOUNT}
                                        />
                                    )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="absolute bottom-4 inset-x-0 px-4 bg-transparent">
                    {(task.status === TaskStatus.Pendiente || isFormDirty) && (
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

                    {task.status === TaskStatus.Finalizada && !isFormDirty && (
                        <View className="border border-border p-4 rounded-full bg-white justify-center items-center flex flex-row space-x-1">
                            <Text className="font-bold">Tarea Enviada</Text>

                            <AntDesign name="checkcircleo" size={16} color="black" />
                        </View>
                    )}

                    {task.status === TaskStatus.Aprobada && (
                        <View className="border border-border p-4 rounded-full bg-white justify-center items-center flex flex-row space-x-1">
                            <Text className="font-bold">Tarea aprobada</Text>

                            <AntDesign name="checkcircleo" size={16} color="black" />
                        </View>
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
                            No se pudo cargar la tarea
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

export default Task;
