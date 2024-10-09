import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Pressable,
} from 'react-native';

import AddImage from './AddImage';
import ImageThumbnail from './ImageThumbnail';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useGetMyAssignedTaskById } from '@/hooks/api/tasks/useGetMyAssignedTaskById';
import { useUpdateMyAssignedTask } from '@/hooks/api/tasks/useUpdateMyAssignedTask';
import useImagePicker from '@/hooks/useImagePicker';
import { stringifyObject, uploadPhoto, cn } from '@/lib/utils';
import { TaskStatus } from '@/models/types';
import { TaskScreenRouteProp } from '@/navigation/types';

import { addFullScreenCameraListener } from '../FullScreenCamera';

const MAX_IMAGE_AMOUNT = 5;
interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}
interface TaskFormInputs {
    workOrderNumber: string;
    images: InputImage[];
}

const Task = ({ route, navigation }: TaskScreenRouteProp) => {
    const { id } = route.params;
    const { data, isPending, refetch, error } = useGetMyAssignedTaskById(id);
    const formMethods = useForm<TaskFormInputs>();
    const { control, setValue, watch, handleSubmit, reset } = formMethods;
    const { pickImage } = useImagePicker();
    const { mutateAsync: updateTask, isPending: isUpdatePending } =
        useUpdateMyAssignedTask();

    const addPictureToTask = async (uri: string) => {
        const currentImages = watch('images') ?? [];
        setValue('images', [...currentImages, { key: '', uri, unsaved: true }]);
        const key = String(await uploadPhoto(uri));
        setValue('images', [...currentImages, { key, uri, unsaved: false }]);
    };

    const navigateToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function navigateToRegisterExpense() {
        navigation.navigate('RegisterExpenseOnTask', { taskId: id });
    }

    function navigateToExpense(expenseId: string) {
        navigation.navigate('ExpenseOnTask', { expenseId, taskId: id });
    }

    const onSubmit: SubmitHandler<TaskFormInputs> = async (formData) => {
        const { workOrderNumber, images } = formData;
        const imageKeys = images.map((image) => image.key);
        await updateTask({
            input: {
                id,
                workOrderNumber,
                imageIdToDelete: null,
                imageKeys,
            },
        });
        reset();
    };

    const selectImage = async () => {
        const uri = await pickImage();
        if (uri) addPictureToTask(uri);
    };

    if (data && !Array.isArray(data)) {
        const task = data.myAssignedTaskById;

        if (!task) {
            return (
                <View className="flex-1">
                    <Text>No se encontró la tarea</Text>
                </View>
            );
        }

        const imagesAmount = (task.images.length ?? 0) + (watch('images')?.length ?? 0);

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
                            <Label className="mb-1.5">Fecha de cierre</Label>
                            <Text className="text-muted-foreground">
                                {task.closedAt
                                    ? format(new Date(task.closedAt), 'dd/MM/yyyy')
                                    : 'Pendiente'}
                            </Text>
                        </View>

                        <View>
                            <Label className="mb-1.5">Auditor</Label>
                            <Text className="text-muted-foreground">
                                {task.auditor ? task.auditor.fullName : 'Pendiente'}
                            </Text>
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
                                                placeholder="Orden de Trabajo"
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

                        <View className="items-start">
                            <Label className="mb-1.5">Gastos</Label>

                            <View className="space-y-2 w-full">
                                {task.expenses.map((expense) => (
                                    <Button
                                        key={expense.id}
                                        onPress={() => navigateToExpense(expense.id)}
                                        className="flex flex-row items-center justify-between"
                                        variant="outline"
                                    >
                                        <ButtonText>
                                            {expense.expenseType} - ${expense.amount}
                                        </ButtonText>

                                        <AntDesign name="right" size={14} color="gray" />
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
                                {task.images.map((image) => (
                                    <ImageThumbnail
                                        key={image.id}
                                        image={image}
                                        maxImageAmount={MAX_IMAGE_AMOUNT}
                                        onPress={() =>
                                            navigation.navigate('FullScreenImage', {
                                                uri: image.url,
                                            })
                                        }
                                    />
                                ))}

                                {watch('images')?.map((image) => (
                                    <ImageThumbnail
                                        key={image.key}
                                        image={image}
                                        maxImageAmount={MAX_IMAGE_AMOUNT}
                                        onPress={() =>
                                            navigation.navigate('FullScreenImage', {
                                                uri: image.uri,
                                            })
                                        }
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
                    {task.status === TaskStatus.Pendiente && (
                        <Pressable
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
                        </Pressable>
                    )}

                    {task.status === TaskStatus.Finalizada && (
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
