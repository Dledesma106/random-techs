import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { format } from 'date-fns';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { ExpenseInput } from '@/api/graphql';
import AddImage from '@/components/AddImage';
import CollapsableText from '@/components/CollapsableText';
import ConfirmButton from '@/components/ConfirmButton';
import ImageThumbnail, { ThumbnailImage } from '@/components/ImageThumbnail';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import Chip from '@/components/ui/Chip';
import Dropdown from '@/components/ui/Dropdown';
import { Form, FormField } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useFinishTask } from '@/hooks/api/tasks/useFinishTask';
import { useGetMyAssignedTaskById } from '@/hooks/api/tasks/useGetMyAssignedTaskById';
import { useUpdateMyAssignedTask } from '@/hooks/api/tasks/useUpdateMyAssignedTask';
import { useGetTechnicians } from '@/hooks/api/useGetTechnicians';
import { useDebouncer } from '@/hooks/useDebouncer';
import useImagePicker from '@/hooks/useImagePicker';
import { showToast } from '@/lib/toast';
import {
    stringifyObject,
    uploadPhoto,
    deletePhoto,
    pascalCaseToSpaces,
} from '@/lib/utils';
import { TaskStatus } from '@/models/types';
import { AssignedTaskScreenRouteProp } from '@/navigation/types';

import { addDeleteExpenseByIdListener } from '../Expense';
import { addDeleteExpenseOnTaskListener } from '../ExpenseOnTaskForm';
import { addFullScreenCameraListener } from '../FullScreenCamera';
import { addRegisterExpenseOnTaskListener } from '../RegisterExpenseOnTask';

const isDevelopment = Constants.expoConfig?.extra?.['environment'] === 'development';

const MAX_IMAGE_AMOUNT = 5;
interface InputImage {
    key: string;
    uri: string;
    unsaved: boolean;
}

interface FormInputs {
    actNumber: string;
    observations: string;
    images: InputImage[];
    expenses: ExpenseInput[];
    imageIdsToDelete: string[];
    expenseIdsToDelete: string[];
    closedAt: Date;
    startedAt: Date;
    participants: string[];
    useMaterials: boolean;
}

const AssignedTask = ({ route, navigation }: AssignedTaskScreenRouteProp) => {
    const { id } = route.params;
    const { data, isPending, refetch, error } = useGetMyAssignedTaskById(id);
    const [fullScreenImage, setFullScreenImage] = useState<ThumbnailImage | null>(null);
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isCloseDatePickerVisible, setCloseDatePickerVisibility] = useState(false);
    const formMethods = useForm<FormInputs>();
    const {
        control,
        setValue,
        watch,
        reset,
        formState: { isDirty },
    } = formMethods;
    const { pickImage } = useImagePicker();
    const { mutateAsync: updateTask } = useUpdateMyAssignedTask();
    const { mutateAsync: finishTask, isPending: isFinishing } = useFinishTask();
    const [customParticipant, setCustomParticipant] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { data: techsData } = useGetTechnicians();

    useEffect(() => {
        const task = data?.myAssignedTaskById;
        if (!task) return;
        reset({
            actNumber: task.actNumber ? String(task.actNumber) : '',
            observations: task.observations ?? '',
            closedAt: task.closedAt ? new Date(task.closedAt) : undefined,
            startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
            images: undefined,
            expenses: undefined,
            participants: task.participants || [],
            useMaterials: task.useMaterials ?? false,
        });
    }, [data]);

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

    const removeExpenseOnForm = (expenseId: string) => {
        const currentExpenses = watch('expenses') ?? [];
        setValue(
            'expenses',
            currentExpenses.filter(
                (expense) =>
                    (expense.imageKeys?.[0] || expense.fileKeys?.[0]) !== expenseId,
            ),
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
        navigation.navigate('Expense', { expenseId });
    }

    function navigateToExpenseOnTaskForm(expense: ExpenseInput) {
        addDeleteExpenseOnTaskListener(removeExpenseOnForm);
        navigation.navigate('ExpenseOnTaskForm', { expense });
    }

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
                showToast('Imagen eliminada', 'success');
            } catch (error) {
                showToast('Error al eliminar imagen', 'error');
            }
        }
        setFullScreenImage(null);
        return;
    };

    const debouncedSave = useDebouncer(async (formData: FormInputs) => {
        try {
            await updateTask({
                input: {
                    id,
                    useMaterials: formData.useMaterials,
                    participants: formData.participants || [],
                    actNumber: formData.actNumber,
                    observations: formData.observations,
                    imageKeys: formData.images?.map((image) => image.key) ?? [],
                    imageIdsToDelete: formData.imageIdsToDelete,
                    expenseIdsToDelete: formData.expenseIdsToDelete,
                    closedAt: formData.closedAt,
                    startedAt: formData.startedAt,
                    expenses: formData.expenses,
                },
            });
            showToast('Cambios guardados', 'success');
        } catch (error) {
            showToast('Error al guardar los cambios', 'error');
        }
    }, 2500);

    const isFormDirty =
        isDirty ||
        watch('images')?.length > 0 ||
        watch('expenses')?.length > 0 ||
        watch('expenseIdsToDelete')?.length > 0 ||
        watch('imageIdsToDelete')?.length > 0 ||
        String(new Date(watch('closedAt'))) !==
            String(new Date(data?.myAssignedTaskById?.closedAt ?? '')) ||
        String(new Date(watch('startedAt'))) !==
            String(new Date(data?.myAssignedTaskById?.startedAt ?? '')) ||
        JSON.stringify(watch('participants')) !==
            JSON.stringify(data?.myAssignedTaskById?.participants || []) ||
        watch('useMaterials') !== data?.myAssignedTaskById?.useMaterials;

    // Observar todos los campos relevantes
    const watchedFields = watch([
        'useMaterials',
        'participants',
        'images',
        'expenses',
        'imageIdsToDelete',
        'expenseIdsToDelete',
        'closedAt',
        'startedAt',
        'actNumber',
        'observations',
    ]);

    useEffect(() => {
        if (isFormDirty && data?.myAssignedTaskById?.status !== TaskStatus.Aprobada) {
            const formData = watch() as FormInputs;
            const savePromise = debouncedSave(formData) as Promise<any> & {
                cancel: () => void;
            };

            return () => {
                savePromise.cancel();
            };
        }
    }, [watchedFields, isFormDirty, debouncedSave]);

    const handleFinishTask = async () => {
        try {
            await finishTask({ id });
            navigation.goBack();
        } catch (error) {
            showToast('' + error, 'error');
        }
    };

    // Preparar los técnicos para el dropdown, filtrando los ya seleccionados por ID o nombre
    const mappedTechs = [
        { label: 'Otro', value: 'other' },
        ...(techsData?.technicians
            ?.filter((tech) => {
                const participants = watch('participants') || [];
                // Filtrar si el ID ya está en la lista
                if (participants.includes(tech.id)) return false;
                // Filtrar si el nombre ya está en la lista
                if (participants.includes(tech.fullName)) return false;
                return true;
            })
            .map((tech) => ({
                label: tech.fullName,
                value: tech.id,
            })) || []),
    ];

    // Función para agregar un participante personalizado
    const addCustomParticipant = () => {
        if (customParticipant.trim()) {
            const currentParticipants = watch('participants') || [];
            setValue('participants', [...currentParticipants, customParticipant], {
                shouldDirty: true,
                shouldTouch: true,
            });
            setCustomParticipant('');
            setSelectedOption(null);
        }
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
        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={isPending} onRefresh={refetch} />
                    }
                    className="flex-1"
                >
                    {isDevelopment && (
                        <>
                            <CollapsableText
                                buttonText="datos de tarea"
                                text={stringifyObject(task)}
                            />
                            <CollapsableText
                                buttonText="datos de formulario"
                                text={stringifyObject(watch())}
                            />
                        </>
                    )}
                    <View className="px-4 pt-4 space-y-4">
                        <View className="items-start">
                            <Badge className="mb-4">
                                <BadgeText>{pascalCaseToSpaces(task.taskType)}</BadgeText>
                            </Badge>

                            <Text className="text-muted-foreground">
                                {task.business?.name ?? task.businessName}
                            </Text>

                            <Text className="text-xl font-bold">
                                {task.branch?.client?.name ?? task.clientName}
                            </Text>
                        </View>

                        <View>
                            <Label>ID de tarea</Label>
                            <Text className="text-muted-foreground">
                                #{task.taskNumber}
                            </Text>
                        </View>

                        {task.branch && (
                            <View>
                                <Label>Sucursal</Label>
                                <Text className="text-muted-foreground">
                                    {task.branch?.number}
                                </Text>
                            </View>
                        )}

                        <View>
                            <Label className="mb-1.5">Fecha de asignación</Label>
                            <Text className="text-muted-foreground">
                                {task.createdAt
                                    ? format(new Date(task.createdAt), 'dd/MM/yyyy')
                                    : 'N/A'}
                            </Text>
                        </View>

                        <View>
                            <Label className="mb-1.5">Técnicos participantes</Label>

                            {task.status !== TaskStatus.Aprobada && (
                                <>
                                    <View className="flex-row items-center space-x-2 mb-2">
                                        <View className="flex-1">
                                            <Dropdown
                                                items={mappedTechs}
                                                placeholder="Selecciona los participantes"
                                                value={
                                                    selectedOption ||
                                                    'Selecciona los participantes'
                                                }
                                                onValueChange={(value) => {
                                                    setSelectedOption(value);
                                                    if (value && value !== 'other') {
                                                        const currentParticipants =
                                                            watch('participants') || [];
                                                        if (
                                                            !currentParticipants.includes(
                                                                value,
                                                            )
                                                        ) {
                                                            setValue(
                                                                'participants',
                                                                [
                                                                    ...currentParticipants,
                                                                    value,
                                                                ],
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldTouch: true,
                                                                },
                                                            );
                                                            setSelectedOption(null);
                                                        }
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {selectedOption === 'other' && (
                                        <View className="flex-row items-center space-x-2 mb-4">
                                            <View className="flex-1">
                                                <TextInput
                                                    placeholder="Agregar otro participante"
                                                    value={customParticipant}
                                                    onChangeText={setCustomParticipant}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                onPress={addCustomParticipant}
                                                className="bg-black p-2 rounded-md"
                                            >
                                                <AntDesign
                                                    name="plus"
                                                    size={20}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}

                            <View className="flex-row flex-wrap mb-4">
                                {watch('participants')?.map((participant) => {
                                    // Verificar si es un ID de técnico o un nombre personalizado
                                    const tech = techsData?.technicians?.find(
                                        (t) => t.id === participant,
                                    );
                                    return (
                                        <Chip
                                            key={participant}
                                            label={tech ? tech.fullName : participant}
                                            onCrossPress={
                                                task.status !== TaskStatus.Aprobada
                                                    ? () => {
                                                          const currentParticipants =
                                                              watch('participants') || [];
                                                          setValue(
                                                              'participants',
                                                              currentParticipants.filter(
                                                                  (p) =>
                                                                      p !== participant,
                                                              ),
                                                              {
                                                                  shouldDirty: true,
                                                                  shouldTouch: true,
                                                              },
                                                          );
                                                      }
                                                    : undefined
                                            } // No mostrar la X cuando está aprobada
                                        />
                                    );
                                })}

                                {watch('participants')?.length === 0 && (
                                    <Text className="text-muted-foreground">
                                        No hay participantes registrados
                                    </Text>
                                )}
                            </View>
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
                            <Label className="mb-1.5">Fecha de inicio</Label>
                            {task.status !== TaskStatus.Aprobada ? (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setStartDatePickerVisibility(true)}
                                    >
                                        <TextInput
                                            inputStyle={{ color: 'black' }}
                                            editable={false}
                                            icon={<EvilIcons name="calendar" size={24} />}
                                        >
                                            {watch('startedAt')
                                                ? format(
                                                      new Date(watch('startedAt')),
                                                      'dd/MM/yyyy HH:mm',
                                                  )
                                                : task.startedAt
                                                  ? format(
                                                        new Date(task.startedAt),
                                                        'dd/MM/yyyy HH:mm',
                                                    )
                                                  : 'Fecha de inicio'}
                                        </TextInput>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isStartDatePickerVisible}
                                        mode="datetime"
                                        onConfirm={(date) => {
                                            setValue('startedAt', date);
                                            setStartDatePickerVisibility(false);
                                        }}
                                        onCancel={() =>
                                            setStartDatePickerVisibility(false)
                                        }
                                        date={watch('startedAt') || new Date()}
                                        maximumDate={watch('closedAt') || undefined}
                                    />
                                </View>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.startedAt
                                        ? format(
                                              new Date(task.startedAt),
                                              'dd/MM/yyyy HH:mm',
                                          )
                                        : 'No especificado'}
                                </Text>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">Fecha de cierre</Label>

                            {task.status !== TaskStatus.Aprobada ? (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setCloseDatePickerVisibility(true)}
                                    >
                                        <TextInput
                                            inputStyle={{ color: 'black' }}
                                            editable={false}
                                            icon={<EvilIcons name="calendar" size={24} />}
                                        >
                                            {watch('closedAt')
                                                ? format(
                                                      new Date(watch('closedAt')),
                                                      'dd/MM/yyyy HH:mm',
                                                  )
                                                : task.closedAt
                                                  ? format(
                                                        new Date(task.closedAt),
                                                        'dd/MM/yyyy HH:mm',
                                                    )
                                                  : 'Fecha de cierre'}
                                        </TextInput>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isCloseDatePickerVisible}
                                        mode="datetime"
                                        onConfirm={(date) => {
                                            setValue('closedAt', date);
                                            setCloseDatePickerVisibility(false);
                                        }}
                                        onCancel={() =>
                                            setCloseDatePickerVisibility(false)
                                        }
                                        date={watch('closedAt') || new Date()}
                                        maximumDate={watch('startedAt') || undefined}
                                    />
                                </View>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.closedAt
                                        ? format(
                                              new Date(task.closedAt),
                                              'dd/MM/yyyy HH:mm',
                                          )
                                        : 'No especificado'}
                                </Text>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">Numero de Acta</Label>
                            {task.status !== TaskStatus.Aprobada ? (
                                <Form {...formMethods}>
                                    <FormField
                                        name="actNumber"
                                        control={control}
                                        defaultValue={String(task.actNumber ?? '')}
                                        render={({
                                            field: { onChange, onBlur, value },
                                        }) => (
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={(val) => {
                                                    onChange(val);
                                                }}
                                                value={value?.toString()}
                                                placeholder={String('Numero de Acta')}
                                                keyboardType="numeric"
                                            />
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.actNumber || 'No especificado'}
                                </Text>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">¿Se usaron materiales?</Label>
                            {task.status !== TaskStatus.Aprobada ? (
                                <Form {...formMethods}>
                                    <FormField
                                        name="useMaterials"
                                        control={control}
                                        defaultValue={task.useMaterials ?? false}
                                        render={({ field: { onChange, value } }) => (
                                            <View className="flex-row space-x-4">
                                                <TouchableOpacity
                                                    className={`flex-row items-center justify-center space-x-2 p-2 rounded-md border w-10 h-10 ${value === true ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
                                                    onPress={() => {
                                                        onChange(true);
                                                    }}
                                                >
                                                    <Text
                                                        className={
                                                            value === true
                                                                ? 'text-white'
                                                                : 'text-black'
                                                        }
                                                    >
                                                        Sí
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    className={`flex-row items-center justify-center space-x-2 p-2 rounded-md border w-10 h-10 ${value === false ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
                                                    onPress={() => {
                                                        onChange(false);
                                                    }}
                                                >
                                                    <Text
                                                        className={
                                                            value === false
                                                                ? 'text-white'
                                                                : 'text-black'
                                                        }
                                                    >
                                                        No
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.useMaterials ? 'Sí' : 'No'}
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
                                                multiline
                                                value={String(value)}
                                                placeholder={'Observaciones'}
                                            />
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Text className="text-muted-foreground">
                                    {task.actNumber || 'No especificado'}
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

                                {watch('expenses') &&
                                    watch('expenses').map((expense, index) => (
                                        <Button
                                            key={index}
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
                                Imágenes de comprobante de trabajo({imagesAmount} de{' '}
                                {MAX_IMAGE_AMOUNT})
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

                {task.status !== TaskStatus.Aprobada &&
                    task.status !== TaskStatus.Finalizada && (
                        <View className="absolute bottom-6 right-0 left-0 flex items-center">
                            <TouchableOpacity
                                onPress={handleFinishTask}
                                disabled={isFinishing}
                                className="bg-black py-3 px-6 rounded-full flex-row items-center"
                            >
                                {isFinishing ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Text className="text-white font-bold mr-2">
                                            Finalizar Tarea
                                        </Text>
                                        <AntDesign
                                            name="checkcircleo"
                                            size={16}
                                            color="white"
                                        />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
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

export default AssignedTask;
