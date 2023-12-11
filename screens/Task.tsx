import { Pressable, Text, View, ScrollView, Alert, TouchableOpacity, BackHandler, ImageBackground, Dimensions } from "react-native";
import { IExpense, IImage, ITask } from "../models/interfaces";
import { useEffect, useState } from "react"
import { Entypo } from '@expo/vector-icons';
import { dmyDateString } from "../lib/utils";
import Input from "../components/Forms/Input";
import { AntDesign } from '@expo/vector-icons';
import { useDB } from "../hooks/useDB";
import DatePicker from './DatePicker'
import { card, cardItem, cardTitle } from "../styles";
import { EvilIcons } from '@expo/vector-icons';
import { Camera, CameraCapturedPicture } from "expo-camera";
import * as MediaLibrary from "expo-media-library"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Image from "../models/Image";
import axios from "axios";
import * as apiEndpoints from '../lib/apiEndpoints'


export default function Task({ route, navigation }: { route: any, navigation: any }) {
    const { task } = route.params
    const { getTaskExpenses } = useDB()
    const [taskExpenses, setTaskExpenses] = useState<IExpense[]>([])
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [photo, setPhoto] = useState<IImage[]>([])                    //* IImage exige que photo sea = {_id: string, name: string, url: string, deleted: boolean}
    const [photoPath, setPhotoPath] = useState<string>();
    const [previewVisible, setPreviewVisible] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<ITask>({
        ...task,
        closedAt: new Date(),
        workOrderNumber: NaN,
    })
    const { width, height } = Dimensions.get("screen");
    const fullScreenImageStyle = {
        width: width / 2, // Ancho igual al ancho de la pantalla
        height: height / 2, // Alto igual al alto de la pantalla
    };

    useEffect(() => {
        const backAction = () => {
            setShowCamera(false)
            setPreviewVisible(false)
            return true
        }
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    let camera: Camera
    useEffect(() => {
        async function getExpenses() {
            setTaskExpenses(await getTaskExpenses(task._id))
        }
        getExpenses()
    }, [])

    async function startCamera() {
        MediaLibrary.requestPermissionsAsync()
        const { status } = await Camera.requestCameraPermissionsAsync()
        if (status === 'granted' && photo.length < 3) setShowCamera(true)
        else Alert.alert('Access denied')
    }

    async function takePicture() {
        if (!camera) return

        // await AsyncStorage.clear() //! por unica vez cada vez que quiera vaciar el storage

        const { uri } = (await camera.takePictureAsync()) //* se obtiene la uri del cache

        //la guardo en un estado
        setPhotoPath(uri)

        // Muestro la vista previa para dar el ok si se guarda
        setPreviewVisible(true)

        //setPhoto(photo)  
        // let prueba = await Image.getAll()
        // console.log("GET ALL Images:"+prueba);

    }

    async function savePicture(photoPath?: string) {
        if (photoPath) {
            console.log(photoPath);
    
            const photoDevice = await MediaLibrary.createAssetAsync(photoPath);
    
            // Crear un Blob directamente desde la imagen
            const imageBlob = await fetch(photoDevice.uri).then(response => response.blob());
    
            const formData = new FormData();
    
            const type = "image/" + photoDevice.uri.split('.').pop();
    
            // Agregar el Blob al FormData
            formData.append('image', imageBlob ,JSON.stringify({
                uri:photoDevice.uri,
                type:type,
                name:"image",
            }));
    
            console.log("formData:  ", formData);
            console.log("photoDevice: ", photoDevice);
            console.log("photoDevice_uri: ", photoDevice.uri);
    
            // Realizar la solicitud HTTP utilizando Axios
            try {
                const response = await axios.post(`${apiEndpoints.baseApiUrl}/images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                console.log("Task => photoId:", response.data);
            } catch (error) {
                console.log(error);
            }
    
            setPreviewVisible(false);
            setShowCamera(false);
        }
    }

    function workOrderNumberChange(newWorkOrderNumber: string) {
        const workOrderNumber = parseInt(newWorkOrderNumber)
        setCurrentTask(prev => ({ ...prev, workOrderNumber }))
    }

    function registerExpense() {
        navigation.navigate('RegisterExpenseOnTask', { task: currentTask })
    }

    function navigateExpense(expense: IExpense) {
        navigation.navigate('Expense', { expense })
    }



    return (
        <>
            {showCamera ?
                previewVisible ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View >
                            {photoPath && <ImageBackground
                                source={{ uri: photoPath }}
                                style={fullScreenImageStyle}
                            />}
                        </View>
                        <Pressable onPress={() => savePicture(photoPath)}>
                            <EvilIcons name="check" size={50} color="green" />
                        </Pressable>
                        <Pressable onPress={() => setPreviewVisible(false)}>
                            <EvilIcons name="close" size={30} color="red" />
                        </Pressable>


                        {/* {photoPath && <Text>Path de la foto: {photoPath}</Text>} */}
                    </View>
                    :
                    <Camera
                        style={{ flex: 1, width: "100%" }}
                        ref={(r) => {
                            camera = r as Camera;
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
                                <View
                                    style={{
                                        width: "90%",
                                        aspectRatio: 3 / 4,
                                        borderWidth: 3,
                                        borderColor: "#ffffff",
                                        borderStyle: "dashed",
                                        borderRadius: 25

                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    position: "absolute",
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "center",
                                    padding: 20,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                <View style={{ alignSelf: "center", alignItems: "center" }}>
                                    <TouchableOpacity
                                        onPress={takePicture}
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 32,
                                            backgroundColor: "#fff",
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Camera>



                :
                <ScrollView className="bg-gray-300 h-screen pt-4">
                    <View className={`${card}`}>
                        <Text className={cardTitle}>Empresa: {task.business.name}</Text>
                        <Text className={cardItem}>Client: {task.branch.client.name}</Text>
                        <Text className={cardItem}>Sucursal: {task.branch.number}</Text>
                        <Text className={cardItem}>Asignado el dia: {dmyDateString(new Date(task.openedAt))}</Text>
                    </View>
                    <View className={`${card}`}>
                        <Text className={cardTitle}>Descripcion</Text>
                        <Text className={cardItem}>{task.taskType} - {task.description}</Text>
                    </View>


                    <View className={card}>
                        <Text className={cardTitle}>Seleccionar fecha de cierre:</Text>
                        <DatePicker />

                    </View>
                    <View className={card}>
                        <Input
                            title="Numero de Orden de Trabajo"
                            value={(currentTask.workOrderNumber as Number).toString() === 'NaN' ? '' : (currentTask.workOrderNumber as Number).toString()}
                            titleStyle={cardTitle}
                            inputStyle={cardItem}
                            custom={
                                {
                                    onChangeText: workOrderNumberChange,
                                    keyboardType: 'numeric',
                                    placeholder: 'Numero de orden de trabajo...'
                                }
                            }
                        />
                    </View>

                    <View className={card}>
                        {
                            taskExpenses.length > 0 && <>
                                <Text className={cardTitle}>Gastos registrados</Text>
                                {
                                    taskExpenses.map(expense => <Pressable onPress={() => { navigateExpense(expense) }}>
                                        <View className={`${cardItem} flex flex-row items-center justify-between`}>
                                            <Text className='text-lg'>un gasto</Text>
                                            <View className='text-lg'>
                                                <AntDesign name="right" size={24} color="black" />
                                            </View>
                                        </View>
                                    </Pressable>)
                                }
                            </>

                        }
                        <Pressable onPress={registerExpense}>
                            <View className={`${taskExpenses.length > 0 ? cardItem : 'p-4'} flex flex-row items-center justify-between`}>
                                <Text className='text-lg'>Registrar un gasto</Text>
                                <View className='text-lg'>
                                    <AntDesign name="right" size={24} color="black" />
                                </View>
                            </View>
                        </Pressable>
                    </View>

                    <View className="mb-5">
                        <Pressable className={`${card} w-3/4`} onPress={startCamera}>
                            <View className="flex flex-row justify-between items-center" >
                                <Text className={cardTitle}>Foto Ticket / Factura</Text>
                                <View className='mr-4 '>
                                    <EvilIcons name="camera" size={32} color="black" />
                                </View>
                            </View>
                        </Pressable>

                    </View>
                    {photo?.map(e =>
                        <View>
                            <View style={{
                                width: 100,
                                height: 100,
                                margin: 10
                            }}>

                                {e.url && <ImageBackground
                                    source={{ uri: e.url }}
                                    style={{ width: '100%', height: '100%' }}
                                />}
                            </View>

                            {/* {photoPath && <Text>Path de la foto: {photoPath}</Text>} */}
                        </View>
                    )}
                </ScrollView>
            }

        </>
    )
}