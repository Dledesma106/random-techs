import { AntDesign, EvilIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTaskUpdateMutation, useUploadImageToTaskMutation } from './mutations';
import { useTaskByIdQuery } from './queries';

import { TaskStatus } from '@/models/types';
import { TaskScreenRouteProp } from '@/navigation/types';

import { dmyDateString } from '../../lib/utils';
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
        const subscription = formMethods.watch((values) => {
            if (values.isClosed !== undefined) {
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
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={taskQueryResult.isPending}
                        onRefresh={taskQueryResult.refetch}
                    />
                }
                className="bg-white h-screen"
            >
                {taskQueryResult.isPending ? <ActivityIndicator /> : null}

                <View>
                    <View className="px-4 pt-4">
                        <Text className="text-gray-600">{task.business.name}</Text>

                        <Text className="text-xl font-bold">
                            {task.branch.client.name}
                        </Text>

                        <Text className="text-gray-600">
                            Sucursal: {task.branch.number} - Asignado:{' '}
                            {dmyDateString(new Date(task.openedAt))}
                        </Text>

                        <View className="pt-4">
                            <Text className="font-semibold mb-1.5">Descripción</Text>
                            <Text className="text-gray-600">
                                {task.taskType} | {task.description}
                            </Text>
                        </View>

                        {task.status === TaskStatus.Pendiente ? (
                            <TouchableOpacity
                                className={clsx(
                                    'bg-black rounded-lg p-4 mt-4',
                                    taskUpdateMutation.isPending ? 'opacity-50' : '',
                                )}
                                onPress={() => {
                                    taskUpdateMutation.mutate({
                                        taskId: task._id,
                                        isClosed: true,
                                    });
                                }}
                                disabled={taskUpdateMutation.isPending}
                            >
                                {taskUpdateMutation.isPending ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text className="text-white text-center font-bold">
                                        Finalizar tarea
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <View className="mt-4">
                                <Text className="font-bold">Tarea finalizada</Text>
                            </View>
                        )}

                        {/* TODO: PREGUNTAR ESTO */}
                        <View className="pt-4">
                            <Text className="font-semibold mb-1.5">Fecha de cierre</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // TODO
                                }}
                            >
                                <TextInput
                                    editable={false}
                                    // value={date.toLocaleDateString()}
                                    placeholder="Seleccionar fecha"
                                    className="p-4 rounded border border-gray-200"
                                />
                            </TouchableOpacity>

                            {/* <DateTimePicker
                                accentColor="black"
                                textColor="black"
                                value={date}
                                mode="date"
                                display="default"
                                onChange={() => {
                                    // TODO
                                }}
                            /> */}
                        </View>

                        {/* TODO: PREGUNTAR ESTO */}
                        <View className="pt-4">
                            <Text className="font-semibold mb-1.5">Orden de Trabajo</Text>
                            <Controller
                                control={formMethods.control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Orden de Trabajo"
                                        className="p-4 rounded border border-gray-200"
                                        keyboardType="numeric"
                                    />
                                )}
                                name="workOrderNumber"
                                defaultValue={task.workOrderNumber?.toString()}
                            />
                        </View>

                        <View className="pt-4">
                            <Text className="font-semibold mb-1.5">Gastos</Text>

                            <View className="space-y-2">
                                {task.expenses.map((expense, index) => (
                                    <TouchableOpacity
                                        key={expense._id}
                                        onPress={() => navigateToExpense(expense._id)}
                                        className="flex flex-row items-center justify-between py-4 border px-4 rounded-lg border-gray-200"
                                    >
                                        <Text className="text-gray-600">
                                            Gasto {index + 1}
                                        </Text>

                                        <AntDesign name="right" size={14} color="gray" />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                onPress={navigateToRegisterExpense}
                                className="flex flex-row items-center justify-between py-1 bg-black rounded p-4 mt-2"
                            >
                                <Text className="text-white font-bold">
                                    Agregar gasto
                                </Text>
                                <AntDesign name="plus" size={14} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {task.images.length > 0 && (
                            <View className="pt-4 pb-4">
                                <Text className="font-semibold mb-1.5">Imágenes</Text>

                                <View className="flex flex-row space-x-4">
                                    {task.images.map((image) => (
                                        <View key={image._id} className="flex-1 relative">
                                            <Image
                                                className="bg-gray-200 relative z-0"
                                                source={{ uri: image.url }}
                                                style={{
                                                    borderRadius: 6,
                                                    aspectRatio: 9 / 16,
                                                }}
                                            />

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
                                </View>
                            </View>
                        )}

                        {task.images.length < 3 && (
                            <View className="pt-4 pb-4">
                                <TouchableOpacity
                                    onPress={navigateToCameraScreen}
                                    className="flex flex-row justify-center items-center bg-black p-4 rounded-xl space-x-4"
                                >
                                    <Text className="font-semibold text-white">
                                        Añadir Imagen
                                    </Text>

                                    <EvilIcons name="camera" size={22} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }

    if (taskQueryResult.error) {
        return (
            <View>
                <Text>Error</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Cargando...</Text>
        </View>
    );
};

export default Task;
