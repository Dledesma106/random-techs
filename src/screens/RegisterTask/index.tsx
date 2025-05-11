import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { format } from 'date-fns';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useState, useRef, useEffect } from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { ExpenseInput, TaskType } from '@/api/graphql';
import AddImage from '@/components/AddImage';
import CollapsableText from '@/components/CollapsableText';
import ConfirmButton from '@/components/ConfirmButton';
import { ExpenseDetailType } from '@/components/ExpenseDetail';
import ImageThumbnail, { ThumbnailImage } from '@/components/ImageThumbnail';
import { Button, ButtonText } from '@/components/ui/button';
import Chip from '@/components/ui/Chip';
import Dropdown from '@/components/ui/Dropdown';
import { Form, FormField } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useUserContext } from '@/context/userContext/useUser';
import { useGetClients } from '@/hooks/api/configs/useGetClients';
import { useCreateMyTask } from '@/hooks/api/tasks/useCreateMyTask';
import { useGetBusinessesOptions } from '@/hooks/api/tasks/useGetBusinessesOptions';
import { useGetTechnicians } from '@/hooks/api/useGetTechnicians';
import useImagePicker from '@/hooks/useImagePicker';
import { showToast } from '@/lib/toast';
import {
    stringifyObject,
    uploadPhoto,
    cn,
    deletePhoto,
    pascalCaseToSpaces,
} from '@/lib/utils';
import { RegisterTaskScreenRouteProp } from '@/navigation/types';

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
    clientId: string;
    clientName: string;
    branchId: string;
    businessId: string;
    businessName: string;
    assigned: string[];
    participants: string[];
    images: InputImage[];
    expenses: ExpenseInput[];
    closedAt: Date;
    startedAt: Date;
    taskType: TaskType;
    useMaterials: boolean;
}

const RegisterTask = ({ navigation }: RegisterTaskScreenRouteProp) => {
    const [fullScreenImage, setFullScreenImage] = useState<ThumbnailImage | null>(null);
    const [isClosedDatePickerVisible, setClosedDatePickerVisibility] = useState(false);
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [customParticipant, setCustomParticipant] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
    const {
        data: clientsData,
        error: clientsError,
        isLoading: isClientsLoading,
        refetch: clientsRefetch,
    } = useGetClients();
    const {
        data: technicians,
        error: techsError,
        isLoading: isTechsLoading,
        refetch: techsRefetch,
    } = useGetTechnicians();
    const { user } = useUserContext();
    const { mutateAsync: createMyTask, isPending: isUpdatePending } = useCreateMyTask();
    const error = clientsError || techsError;
    const clients = clientsData?.clients;
    const mappedClients = [
        ...(clients?.map((client) => ({
            label: client.name,
            value: client.id,
        })) ?? []),
        { label: 'Otro', value: 'other' },
    ];
    const selectedClient = watch('clientId')
        ? clients?.find((client) => client.id === watch('clientId'))
        : undefined;
    const mappedBranches =
        selectedClient?.branches.map((branch) => ({
            label: `${branch.number && `${branch.number}, `}${branch.name && `${branch.name}, `}${branch.city.name}`,
            value: branch.id,
        })) ?? [];
    const selectedBranch = watch('branchId')
        ? selectedClient?.branches.find((branch) => branch.id === watch('branchId'))
        : undefined;
    const businessOptions = useGetBusinessesOptions(watch('branchId'));
    const mappedBusinesses = [
        ...(selectedBranch
            ? (selectedBranch.businesses.map((business) => ({
                  label: business.name,
                  value: business.id,
              })) ?? [])
            : (businessOptions?.data?.branchBusinesses.map((business) => ({
                  label: business.name,
                  value: business.id,
              })) ?? [])),
        { label: 'Otro', value: 'other' },
    ];
    const mappedTechs =
        technicians?.technicians
            .filter((tech) => tech.id !== user?.id)
            .filter((tech) => {
                const participants = watch('participants') || [];
                if (participants.includes(tech.id)) return false;
                if (participants.includes(tech.fullName)) return false;
                return true;
            })
            .map((tech) => ({
                label: tech.fullName,
                value: tech.id,
            })) ?? [];
    const mappedTechsWithOther = [{ label: 'Otro', value: 'other' }, ...mappedTechs];
    const selectedTechs = technicians?.technicians.filter((tech) =>
        watch('participants')?.includes(tech.id),
    );
    const taskTypes = Object.values(TaskType);
    const mappedTaskTypes = taskTypes?.map((taskType) => ({
        label: pascalCaseToSpaces(taskType),
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

    const navigateToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function navigateToRegisterExpense() {
        addRegisterExpenseOnTaskListener(addExpenseToTask);
        navigation.navigate('RegisterExpenseOnTask', { taskId: '' });
    }

    function navigateToExpenseOnTaskForm(expense: ExpenseDetailType) {
        addDeleteExpenseOnTaskListener(removeExpenseOnForm);
        navigation.navigate('ExpenseOnTaskForm', { expense });
    }

    const refetch = () => {
        clientsRefetch();
        techsRefetch();
    };

    const isLoading = isClientsLoading || isTechsLoading || isUpdatePending;

    const addCustomParticipant = () => {
        if (customParticipant.trim()) {
            const currentParticipants = watch('participants') || [];
            setValue('participants', [...currentParticipants, customParticipant]);
            setCustomParticipant('');
            setSelectedOption(null);
        }
    };

    const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
        const {
            actNumber,
            images,
            observations,
            closedAt,
            expenses,
            branchId,
            businessId,
            clientId,
            clientName,
            businessName,
            startedAt,
            taskType,
            participants,
            useMaterials,
        } = formData;

        if (clientId === 'other' && !clientName?.trim()) {
            showToast('Debe especificar el nombre del cliente', 'error');
            return;
        }

        if (businessId === 'other' && !businessName?.trim()) {
            showToast('Debe especificar el nombre de la empresa', 'error');
            return;
        }

        if (clientId !== 'other' && !branchId) {
            showToast('Debe seleccionar una sucursal', 'error');
            return;
        }

        if (!taskType) {
            showToast('Debe seleccionar un tipo de tarea', 'error');
            return;
        }

        if (images && images.length > 0 && images.some((image) => image.unsaved)) {
            showToast('Espere a que se guarden las imágenes', 'error');
            return;
        }

        const imageKeys = images ? images.map((image) => image.key) : [];
        try {
            await createMyTask({
                input: {
                    branch: clientId === 'other' ? null : branchId,
                    business: businessId === 'other' ? null : businessId,
                    assigned: [user?.id ?? ''],
                    participants: participants || [],
                    taskType,
                    observations,
                    actNumber,
                    imageKeys,
                    closedAt,
                    expenses,
                    clientName,
                    businessName,
                    startedAt,
                    useMaterials,
                },
            });
            navigation.goBack();
            reset({
                actNumber: '',
                observations: '',
                clientId: '',
                clientName: '',
                branchId: '',
                businessId: '',
                businessName: '',
                assigned: [],
                participants: [],
                images: [],
                expenses: [],
                closedAt: undefined,
                startedAt: undefined,
                taskType: '' as TaskType,
                useMaterials: false,
            });
        } catch (error) {
            showToast(`Error al crear la tarea: ${error}`, 'error');
        }
    };
    const isOtherClient = watch('clientId') === 'other';
    const isOtherBusiness = watch('businessId') === 'other';

    const handleDeleteImage = async (image: ThumbnailImage) => {
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

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        });

        return unsubscribe;
    }, [navigation]);

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
                    ref={scrollViewRef}
                    className="flex-1"
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                    }
                >
                    {isDevelopment && (
                        <CollapsableText
                            buttonText="datos de desarrollo"
                            text={stringifyObject(watch())}
                        />
                    )}
                    <View className="px-4 pt-4 pb-24 space-y-4">
                        <Label className="mb-1.5">
                            Recorda que esta opcion es solo para casos de emergencia
                        </Label>
                        <View>
                            <Label className="mb-1.5">Cliente</Label>
                            <Dropdown
                                items={mappedClients}
                                placeholder="Selecciona un cliente"
                                value={watch('clientId')}
                                onValueChange={(value) => {
                                    setValue('clientId', value ?? '');
                                    if (value !== 'other') {
                                        setValue('clientName', '');
                                    }
                                    setValue('branchId', '');
                                    setValue('businessId', '');
                                    setValue('businessName', '');
                                }}
                            />
                            {isOtherClient && (
                                <View className="mt-2">
                                    <TextInput
                                        placeholder="Nombre del cliente"
                                        value={watch('clientName')}
                                        onChangeText={(value) =>
                                            setValue('clientName', value)
                                        }
                                    />
                                </View>
                            )}
                        </View>
                        {!isOtherClient && (
                            <View>
                                <Label className="mb-1.5">Sucursal</Label>
                                <Dropdown
                                    items={mappedBranches}
                                    value={watch('branchId')}
                                    placeholder="Selecciona una sucursal"
                                    onValueChange={(value) =>
                                        setValue('branchId', value ?? '')
                                    }
                                />
                            </View>
                        )}
                        <View>
                            <Label className="mb-1.5">Empresa</Label>
                            <Dropdown
                                items={mappedBusinesses}
                                placeholder="Selecciona una empresa"
                                value={watch('businessId')}
                                onValueChange={(value) => {
                                    setValue('businessId', value ?? '');
                                    if (value !== 'other') {
                                        setValue('businessName', '');
                                    }
                                }}
                            />
                            {isOtherBusiness && (
                                <View className="mt-2">
                                    <TextInput
                                        placeholder="Nombre de la empresa"
                                        value={watch('businessName')}
                                        onChangeText={(value) =>
                                            setValue('businessName', value)
                                        }
                                    />
                                </View>
                            )}
                        </View>

                        <View>
                            <Label className="mb-1.5">Tipo de tarea</Label>
                            <Dropdown
                                items={mappedTaskTypes}
                                placeholder="Selecciona el tipo de tarea"
                                value={watch('taskType')}
                                onValueChange={(value) =>
                                    setValue('taskType', value as TaskType)
                                }
                            />
                        </View>

                        <View>
                            <Label className="mb-1.5">Técnicos participantes</Label>
                            <View className="flex-row items-center space-x-2 mb-2">
                                <View className="flex-1">
                                    <Dropdown
                                        items={mappedTechsWithOther}
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
                                                    !currentParticipants.includes(value)
                                                ) {
                                                    setValue('participants', [
                                                        ...currentParticipants,
                                                        value,
                                                    ]);
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
                                        <AntDesign name="plus" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View className="flex-row flex-wrap mb-4">
                                {selectedTechs &&
                                    selectedTechs.map((tech) => (
                                        <Chip
                                            key={tech.id}
                                            label={tech.fullName}
                                            onCrossPress={() => {
                                                const currentParticipants =
                                                    watch('participants') || [];
                                                setValue(
                                                    'participants',
                                                    currentParticipants.filter(
                                                        (id) => id !== tech.id,
                                                    ),
                                                );
                                            }}
                                        />
                                    ))}

                                {watch('participants')
                                    ?.filter(
                                        (participant) =>
                                            !technicians?.technicians?.some(
                                                (tech) => tech.id === participant,
                                            ),
                                    )
                                    .map((customName) => (
                                        <Chip
                                            key={customName}
                                            label={customName}
                                            onCrossPress={() => {
                                                const currentParticipants =
                                                    watch('participants') || [];
                                                setValue(
                                                    'participants',
                                                    currentParticipants.filter(
                                                        (name) => name !== customName,
                                                    ),
                                                );
                                            }}
                                        />
                                    ))}
                            </View>
                        </View>

                        <View>
                            <Label className="mb-1.5">Fecha de inicio</Label>
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
                                            : 'Fecha de inicio'}
                                    </TextInput>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isStartDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={(date) => {
                                        setValue('startedAt', date);
                                        // Verificar si la fecha de inicio es mayor a la fecha de cierre existente
                                        const currentClosedAt = watch('closedAt');
                                        if (currentClosedAt && date > currentClosedAt) {
                                            // Si la fecha de inicio es mayor, actualizar la fecha de cierre
                                            setValue('closedAt', date);
                                        }
                                        setStartDatePickerVisibility(false);
                                    }}
                                    onCancel={() => setStartDatePickerVisibility(false)}
                                    date={watch('startedAt') || new Date()}
                                    maximumDate={new Date()}
                                />
                            </View>
                        </View>

                        <View>
                            <Label className="mb-1.5">Fecha de cierre</Label>
                            <View>
                                <TouchableOpacity
                                    onPress={() => setClosedDatePickerVisibility(true)}
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
                                            : 'Fecha de cierre'}
                                    </TextInput>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isClosedDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={(date) => {
                                        setValue('closedAt', date);
                                        setClosedDatePickerVisibility(false);
                                    }}
                                    onCancel={() => setClosedDatePickerVisibility(false)}
                                    date={watch('closedAt') || new Date()}
                                    minimumDate={watch('startedAt') || undefined}
                                    maximumDate={new Date()}
                                />
                            </View>
                        </View>

                        <View>
                            <Label className="mb-1.5">Numero de Acta</Label>

                            <Form {...formMethods}>
                                <FormField
                                    name="actNumber"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(val) => {
                                                onChange(val);
                                            }}
                                            value={value?.toString()}
                                            placeholder="Numero de Acta"
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </Form>
                        </View>

                        <View>
                            <Label className="mb-1.5">¿Se usaron materiales?</Label>
                            <Form {...formMethods}>
                                <FormField
                                    name="useMaterials"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field: { onChange, value } }) => (
                                        <View className="flex-row space-x-4">
                                            <TouchableOpacity
                                                className={`flex-row items-center space-x-2 p-2 h-10 w-10 justify-center rounded-md border ${value === true ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
                                                onPress={() => onChange(true)}
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
                                                className={`flex-row items-center space-x-2 p-2 h-10 w-10 justify-center rounded-md border ${value === false ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
                                                onPress={() => onChange(false)}
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
                                            multiline
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
                                Imágenes de comprobante de trabajo ({imagesAmount} de{' '}
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
                                Crear tarea
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
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
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
