import { AntDesign, EvilIcons } from '@expo/vector-icons';
import dateFns from 'date-fns';
import { useEffect } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    Image,
    RefreshControl,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTaskUpdateMutation, useUploadImageToTaskMutation } from './mutations';
import { useTaskByIdQuery } from './queries';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { TextInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { TaskStatus } from '@/models/types';
import { TaskScreenRouteProp } from '@/navigation/types';

import { cn } from '../../lib/utils';
import { addFullScreenCameraListener } from '../FullScreenCamera';

type FormValues = {
    isClosed?: boolean;
    workOrderNumber?: string;
    imagesIdToDelete?: string;
};

const Task = ({ route, navigation }: TaskScreenRouteProp) => {
    const { id } = route.params;
    const taskQueryResult = useTaskByIdQuery(id);
    const formMethods = useForm<FormValues>();

    const uploadImageMutation = useUploadImageToTaskMutation();
    const taskUpdateMutation = useTaskUpdateMutation();

    useEffect(() => {
        const subscription = formMethods.watch((values, { name, type }) => {
            if (name === 'isClosed' && type === 'change') {
                if (values.isClosed === undefined) {
                    return;
                }

                taskUpdateMutation.mutate({
                    taskId: id,
                    isClosed: values.isClosed,
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [formMethods.watch]);

    const addPictureToTask = (uri: string) => {
        uploadImageMutation.mutate({
            taskId: id,
            localURI: uri,
        });
    };

    const navigateToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function navigateToRegisterExpense() {
        navigation.navigate('RegisterExpenseOnTask', { taskId: id });
    }

    function navigateToExpense(id: string) {
        navigation.navigate('ExpenseOnTask', { expenseId: id });
    }

    if (taskQueryResult.data && !Array.isArray(taskQueryResult.data)) {
        const task = taskQueryResult.data;

        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={taskQueryResult.isPending}
                            onRefresh={taskQueryResult.refetch}
                        />
                    }
                    className="flex-1"
                >
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
                                {dateFns.format(new Date(task.openedAt), 'dd/MM/yyyy')}
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
                                {task.closedAt ? (
                                    dateFns.format(new Date(task.closedAt), 'dd/MM/yyyy')
                                ) : (
                                    <Text className="text-primary">Pendiente</Text>
                                )}
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
                            <Form {...formMethods}>
                                <FormField
                                    name="workOrderNumber"
                                    control={formMethods.control}
                                    defaultValue={task.workOrderNumber?.toString()}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Orden de Trabajo"
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </Form>
                        </View>

                        <View>
                            <Label className="mb-1.5">Gastos</Label>

                            <View className="space-y-2">
                                {task.expenses.map((expense, index) => (
                                    <Button
                                        key={expense._id}
                                        onPress={() => navigateToExpense(expense._id)}
                                        className="flex flex-row items-center justify-between"
                                        variant="outline"
                                    >
                                        <ButtonText>Gasto {index + 1}</ButtonText>

                                        <AntDesign name="right" size={14} color="gray" />
                                    </Button>
                                ))}
                            </View>

                            <View className="flex flex-row justify-start">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onPress={navigateToRegisterExpense}
                                >
                                    <ButtonText>Agregar gasto</ButtonText>
                                </Button>
                            </View>
                        </View>

                        <View>
                            <Label className="mb-1.5">
                                Imágenes ({task.images.length} de 3)
                            </Label>

                            <View className="flex flex-row space-x-4">
                                {task.images.map((image) => (
                                    <View
                                        key={image._id}
                                        className="flex-[0.33] relative"
                                    >
                                        <Image
                                            className="bg-gray-200 relative z-0"
                                            source={{ uri: image.url }}
                                            style={{
                                                borderRadius: 6,
                                                aspectRatio: 9 / 16,
                                            }}
                                        />

                                        {image.unsaved && (
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

                                        <View className="absolute top-2 right-2 bg-black flex items-center justify-center rounded-full z-50 w-6 h-6">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    taskUpdateMutation.mutate({
                                                        taskId: task._id,
                                                        imageIdToDelete: image._id,
                                                    });
                                                }}
                                            >
                                                <AntDesign
                                                    name="close"
                                                    size={14}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                {task.images.length < 3 && (
                                    <View className="flex-[0.33] relative border border-border">
                                        <TouchableOpacity
                                            onPress={navigateToCameraScreen}
                                            className="bg-muted flex items-center justify-center"
                                            style={{
                                                aspectRatio: 9 / 16,
                                            }}
                                        >
                                            <View className="items-center">
                                                <EvilIcons
                                                    name="camera"
                                                    size={32}
                                                    color="#4B5563"
                                                />

                                                <Text className="text-[#4B5563] text-xs">
                                                    Agregar
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="absolute bottom-4 inset-x-0 px-4 bg-transparent">
                    {task.status === TaskStatus.Pendiente ? (
                        <Pressable
                            onPress={() => {
                                taskUpdateMutation.mutate({
                                    taskId: task._id,
                                    isClosed: true,
                                });
                            }}
                            className="border border-border p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1 relative"
                        >
                            <Text
                                className={cn(
                                    'font-bold text-white',
                                    taskUpdateMutation.isPending && 'opacity-0',
                                )}
                            >
                                Finalizar tarea
                            </Text>

                            {taskUpdateMutation.isPending && (
                                <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                                    <ActivityIndicator size="small" color="black" />
                                </View>
                            )}
                        </Pressable>
                    ) : (
                        <View className="border border-border p-4 rounded-full bg-white justify-center items-center flex flex-row space-x-1">
                            <Text className="font-bold">Tarea finalizada</Text>

                            <AntDesign name="checkcircleo" size={16} color="black" />
                        </View>
                    )}
                </View>
            </View>
        );
    }

    if (taskQueryResult.error) {
        return (
            <View className="flex-1 bg-white">
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={taskQueryResult.isPending}
                            onRefresh={taskQueryResult.refetch}
                        />
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
