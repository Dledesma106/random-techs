import { EvilIcons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import {
    Pressable,
    Text,
    View,
    ScrollView,
    Alert,
    TouchableOpacity,
    BackHandler,
    ImageBackground,
    Dimensions,
    Image,
} from 'react-native';

import { TaskScreenRouteProp } from '@/navigation/types';

import { card, cardItem, cardTitle } from '../../../styles';
import Input from '../../components/Forms/Input';
import { useDb } from '../../hooks/useDB';
import * as apiEndpoints from '../../lib/apiEndpoints';
import { dmyDateString } from '../../lib/utils';
import { IClient, IExpense, ITask } from '../../models/interfaces';
import DatePicker from '../DatePicker';

const Task = ({ route, navigation }: TaskScreenRouteProp) => {
    const { task } = route.params;
    const { getTaskExpenses } = useDb();
    const [taskExpenses, setTaskExpenses] = useState<IExpense[]>([]);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [photoPath, setPhotoPath] = useState<string>();
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentTask, setCurrentTask] = useState<ITask>({
        ...task,
        closedAt: new Date(),
        workOrderNumber: NaN,
    });
    const { width, height } = Dimensions.get('screen');
    const fullScreenImageStyle = {
        width: width / 2, // Ancho igual al ancho de la pantalla
        height: height / 2, // Alto igual al alto de la pantalla
    };

    useEffect(() => {
        const backAction = () => {
            setShowCamera(false);
            setPreviewVisible(false);
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    let camera: Camera;
    useEffect(() => {
        async function getExpenses() {
            setTaskExpenses(await getTaskExpenses(task._id));
        }
        getExpenses();
    }, []);

    async function startCamera() {
        MediaLibrary.requestPermissionsAsync();
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted' && task.image.length < 3) setShowCamera(true);
        else Alert.alert('Access denied');
    }

    async function takePicture() {
        if (!camera) return;

        // await AsyncStorage.clear() //! por unica vez cada vez que quiera vaciar el storage

        const { uri } = await camera.takePictureAsync();
        setPhotoPath(uri);

        setPreviewVisible(true);
    }

    async function savePicture(photoPath?: string) {
        const name = photoPath?.split('/').pop();
        if (!photoPath || !name) {
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: photoPath,
            name: name,
            type: 'image/jpeg',
        });

        try {
            await axios.post(
                `${apiEndpoints.baseApiUrl}images?taskId=${(task as ITask)._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
        } catch (error) {}

        setPreviewVisible(false);
        setShowCamera(false);
    }

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

    return (
        <>
            {showCamera ? (
                previewVisible ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            {photoPath && (
                                <ImageBackground
                                    source={{ uri: photoPath }}
                                    style={fullScreenImageStyle}
                                />
                            )}
                        </View>
                        <Pressable onPress={async () => await savePicture(photoPath)}>
                            <EvilIcons name="check" size={50} color="green" />
                        </Pressable>
                        <Pressable onPress={() => setPreviewVisible(false)}>
                            <EvilIcons name="close" size={30} color="red" />
                        </Pressable>

                        {/* {photoPath && <Text>Path de la foto: {photoPath}</Text>} */}
                    </View>
                ) : (
                    <Camera
                        style={{ flex: 1, width: '100%' }}
                        ref={(r) => {
                            camera = r as Camera;
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 50,
                                }}
                            >
                                <View
                                    style={{
                                        width: '90%',
                                        aspectRatio: 3 / 4,
                                        borderWidth: 3,
                                        borderColor: '#ffffff',
                                        borderStyle: 'dashed',
                                        borderRadius: 25,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                    padding: 20,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                <View
                                    style={{ alignSelf: 'center', alignItems: 'center' }}
                                >
                                    <TouchableOpacity
                                        onPress={takePicture}
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 32,
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Camera>
                )
            ) : (
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
                                (currentTask.workOrderNumber as number).toString() ===
                                'NaN'
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
                                                <AntDesign
                                                    name="right"
                                                    size={24}
                                                    color="black"
                                                />
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

                    <Text>{JSON.stringify(currentTask.image)}</Text>

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
                        <Pressable className={`${card} w-3/4`} onPress={startCamera}>
                            <View className="flex flex-row justify-between items-center">
                                <Text className={cardTitle}>Foto Ticket / Factura</Text>
                                <View className="mr-4 ">
                                    <EvilIcons name="camera" size={32} color="black" />
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
        </>
    );
};

export default Task;
