import { Pressable, Text, View, ScrollView, Alert, TouchableOpacity,BackHandler } from "react-native";
import { IExpense, ITask } from "../models/interfaces";
import { useEffect, useState } from "react"
import { Entypo } from '@expo/vector-icons';
import { dmyDateString } from "../lib/utils";
import Input from "../components/Forms/Input";
import { AntDesign } from '@expo/vector-icons';
import { useDB } from "../hooks/useDB";
import DatePicker from './DatePicker'
import DB from "../lib/DB";
import { card, cardItem, cardTitle } from "../styles";
import { EvilIcons } from '@expo/vector-icons';
import { Camera, CameraCapturedPicture } from "expo-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Image from "../models/Image";
import axios from "axios";



export default function Task({route, navigation}:{route:any, navigation:any}){
    const {task} = route.params
    const {getTaskExpenses} = useDB()
    const [taskExpenses, setTaskExpenses] = useState<IExpense[]>([])
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [photo, setPhoto] = useState<CameraCapturedPicture>()
    const [photoPath, setPhotoPath] = useState<string>();
    const [previewVisible, setPreviewVisible] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<ITask>({
        ...task,
        closedAt:new Date(),
        workOrderNumber: NaN,
    

    })

    useEffect(()=>{
        const backAction = ()=>{
            setShowCamera(false)
            return true
        }
        const backHandler = BackHandler.addEventListener("hardwareBackPress",backAction)
        return ()=> backHandler.remove()
    },[])

    let camera: Camera
    useEffect(()=>{
        async function getExpenses(){
            setTaskExpenses(await getTaskExpenses(task._id))
        }
        getExpenses()
    }, [])

    async function startCamera(){
        const {status} = await Camera.requestCameraPermissionsAsync()
        if(status === 'granted') setShowCamera(true)
        else Alert.alert('Access denied')
    }

    async function takePicture(){
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo);
        
        setPhoto(photo)
        setShowCamera(false)
        setPreviewVisible(true)
        Image.set({ _id: "1", url: photo.uri, deleted: false })
        setPhotoPath(photo.uri);        
    }


    function workOrderNumberChange(newWorkOrderNumber:string){
        const workOrderNumber = parseInt(newWorkOrderNumber)
        setCurrentTask(prev => ({...prev, workOrderNumber}))
    }

    function registerExpense(){
        navigation.navigate('RegisterExpenseOnTask', {task:currentTask})
    }   
    
    function navigateExpense(expense:IExpense){
        navigation.navigate('Expense', {expense})
    }
//Enviando la data a la DB:

    async function savingData(){
        await DB.create("photoCollection", photoPath);
        const [photo, setPhoto] = useState();
        const foto = DB.read("photoCollection","1")
    }

   

    return(
        <>
            { showCamera? 
              <Camera
              style={{ flex: 1, width: "100%" }}
              ref={(r) => {
                camera = r as Camera;
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center",marginBottom:50 }}>
                 <View
                    style={{
                      width:"90%",
                      aspectRatio: 3/4,
                      borderWidth: 3,
                      borderColor: "#ffffff",
                      borderStyle:"dashed",
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
                        value={(currentTask.workOrderNumber as Number).toString()==='NaN'? '':(currentTask.workOrderNumber as Number).toString()} 
                        titleStyle={cardTitle} 
                        inputStyle={cardItem} 
                        custom={
                            {
                                onChangeText:workOrderNumberChange,
                                keyboardType:'numeric',
                                placeholder:'Numero de orden de trabajo...'
                            }
                        }
                    />
                </View>

                <View className={card}> 
                    {
                        taskExpenses.length>0 && <>
                            <Text className={cardTitle}>Gastos registrados</Text>
                            {
                                taskExpenses.map(expense => <Pressable onPress={()=>{navigateExpense(expense)}}>
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
                        <View className={`${taskExpenses.length>0?cardItem:'p-4'} flex flex-row items-center justify-between`}>
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
                <View>
     
  {photoPath && <Text>Path de la foto: {photoPath}</Text>}
</View>
            </ScrollView>
            }
  
        </>
    )
}