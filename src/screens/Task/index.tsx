import { EvilIcons, AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View, ScrollView, Image, Dimensions } from 'react-native';

import { useUploadImageToTaskMutation } from './mutations';

import useCamera from '@/hooks/useCamera';
import { TaskScreenRouteProp } from '@/navigation/types';

import { card, cardItem, cardTitle } from '../../../styles';
import Input from '../../components/Forms/Input';
import { useDb } from '../../hooks/useDB';
import { dmyDateString } from '../../lib/utils';
import { IClient, IExpense, ITask } from '../../models/interfaces';
import DatePicker from '../DatePicker';
import { addFullScreenCameraListener } from '../FullScreenCamera';

const Task = ({ route, navigation }: TaskScreenRouteProp) => {
    const { task } = route.params;
    const { getTaskExpenses } = useDb();

    const cameraResult = useCamera();
    const uploadImageMutation = useUploadImageToTaskMutation();

    const [taskExpenses, setTaskExpenses] = useState<IExpense[]>([]);
    const [currentTask, setCurrentTask] = useState<ITask>({
        ...task,
        closedAt: new Date(),
        workOrderNumber: NaN,
    });

    useEffect(() => {
        async function getExpenses() {
            setTaskExpenses(await getTaskExpenses(task._id));
        }
        getExpenses();
    }, []);

    const addPictureToTask = (uri: string) => {
        uploadImageMutation.mutate(
            {
                taskId: task._id,
                localURI: uri,
            },
            {
                onSuccess: () => {
                    cameraResult.deactivate();
                },
            },
        );
    };

    const goToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    function workOrderNumberChange(newWorkOrderNumber: string) {
        const workOrderNumber = parseInt(newWorkOrderNumber);
        setCurrentTask((prev) => ({ ...prev, workOrderNumber }));
    }

    function registerExpense() {
        navigation.navigate('RegisterExpenseOnTask', { task: currentTask });
    }

    function navigateExpense(expense: IExpense) {
        navigation.navigate('Expense', { expense });
    }

    const { width, height } = Dimensions.get('screen');
    const fullScreenImageStyle = {
        width: width / 2,
        height: height / 2,
    };

    return (
        <ScrollView className="bg-gray-300 h-screen pt-4">
            <View className={`${card}`}>
                <Text className={cardTitle}>Empresa: {task.business.name}</Text>
                <Text className={cardItem}>
                    Client: {(task.branch.client as IClient).name}
                </Text>
                <Text className={cardItem}>Sucursal: {task.branch.number}</Text>
                <Text className={cardItem}>
                    Asignado el dia: {dmyDateString(new Date(task.openedAt))}
                </Text>
            </View>
            <View className={`${card}`}>
                <Text className={cardTitle}>Descripcion</Text>
                <Text className={cardItem}>
                    {task.taskType} - {task.description}
                </Text>
            </View>

            <View className={card}>
                <Text className={cardTitle}>Seleccionar fecha de cierre:</Text>
                <DatePicker />
            </View>
            <View className={card}>
                <Input
                    title="Numero de Orden de Trabajo"
                    value={
                        (currentTask.workOrderNumber as number).toString() === 'NaN'
                            ? ''
                            : (currentTask.workOrderNumber as number).toString()
                    }
                    titleStyle={cardTitle}
                    inputStyle={cardItem}
                    custom={{
                        onChangeText: workOrderNumberChange,
                        keyboardType: 'numeric',
                        placeholder: 'Numero de orden de trabajo...',
                    }}
                />
            </View>

            <View className={card}>
                {taskExpenses.length > 0 && (
                    <>
                        <Text className={cardTitle}>Gastos registrados</Text>
                        {taskExpenses.map((expense) => (
                            <Pressable
                                onPress={() => {
                                    navigateExpense(expense);
                                }}
                            >
                                <View
                                    className={`${cardItem} flex flex-row items-center justify-between`}
                                >
                                    <Text className="text-lg">un gasto</Text>
                                    <View className="text-lg">
                                        <AntDesign name="right" size={24} color="black" />
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </>
                )}
                <Pressable onPress={registerExpense}>
                    <View
                        className={`${
                            taskExpenses.length > 0 ? cardItem : 'p-4'
                        } flex flex-row items-center justify-between`}
                    >
                        <Text className="text-lg">Registrar un gasto</Text>
                        <View className="text-lg">
                            <AntDesign name="right" size={24} color="black" />
                        </View>
                    </View>
                </Pressable>
            </View>

            {currentTask.image.length > 0 && (
                <View className="mb-5">
                    <Text className={cardTitle}>Foto Ticket / Factura</Text>
                    <View className="flex flex-col space-y-4 justify-between items-center">
                        {currentTask.image.map((e) => (
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    padding: 10,
                                }}
                                key={e._id}
                            >
                                <Image
                                    source={{
                                        uri: e.url,
                                        width: 1080,
                                        height: 1920,
                                    }}
                                    style={fullScreenImageStyle}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View className="mb-5">
                <Pressable className={`${card} w-3/4`} onPress={goToCameraScreen}>
                    <View className="flex flex-row justify-between items-center">
                        <Text className={cardTitle}>Foto Ticket / Factura</Text>
                        <View className="mr-4 ">
                            <EvilIcons name="camera" size={32} color="black" />
                        </View>
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default Task;
