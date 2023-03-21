import { useState } from "react";
import { Text, View, ScrollView, Pressable, Alert, TouchableOpacity } from "react-native";
import {card, cardItem, cardTitle} from '../styles'
import { dmyDateString } from "../lib/utils";
import { AntDesign } from '@expo/vector-icons';
import { ExpenseType, expenseTypes, PaySource, paySources } from "../models/types";
import { EvilIcons } from '@expo/vector-icons';
import {Camera, CameraCapturedPicture} from 'expo-camera'


export default function RegisterExpenseOnTask({route, navigation}:{route:any, navigation:any}){
    const {task} = route.params
    const [showTypes, setShowTypes] = useState<boolean>(false)
    const [expenseType, setExpenseType] = useState<ExpenseType>(expenseTypes[0])
    const [showSources, setShowSources] = useState<boolean>(false)
    const [paySource, setPaySource] = useState<PaySource>(paySources[0])
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [photo, setPhoto] = useState<CameraCapturedPicture>()
    const [previewVisible, setPreviewVisible] = useState(false)
    
    let camera: Camera

    console.log(task)

    async function startCamera(){
        const {status} = await Camera.requestCameraPermissionsAsync()
        if(status === 'granted') setShowCamera(true)
        else Alert.alert('Access denied')
    }

    async function takePicture(){
        if (!camera) return
        const photo = await camera.takePictureAsync()
        setPhoto(photo)
        setShowCamera(false)
        setPreviewVisible(true)
    }

    function selectType(type:ExpenseType){
        setExpenseType(type)
        setShowTypes(false)
    }

    function selectSource(source:PaySource){
        setPaySource(source)
        setShowSources(false)
    }

    function goBack(){
        navigation.navigate('Task', {task})
    }

    return (
        <>
            { showCamera? 
                <Camera
                style={{flex: 1,width:"100%"}}
                ref={(r) => {
                    camera = r as Camera
                }}
                >
                    <View className="absolute flex flex-row w-screen justify-between p-5">
                        <View className="flex self-center items-center">
                            <TouchableOpacity onPress={takePicture} className=' w-16 h-16 rounded-full bg-white'/>
                        </View>
                    </View>
                </Camera>
                
                :

                <ScrollView className="bg-gray-300 h-screen py-4">

                    <Pressable className="rounded-full bg-gray-50 p-4 ml-4 mb-4 w-14" onPress={goBack}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </Pressable>

                    <View className={card}>
                        <Text className={cardTitle}>Fecha de gasto</Text>
                        <Text className={cardItem}>{`${task.closedAt?dmyDateString(task.closedAt):'Aun no hay fecha de cierre seleccionada'}`}</Text>
                    </View>

                    <View className={`${card} `}>
                        <Pressable className="flex flex-row justify-between items-center" onPress={()=>setShowTypes(true)}>
                            <Text className={cardTitle }>Tipo de gasto</Text>
                            <View className="pr-4">
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </Pressable>
                        {
                            !showTypes && <Text className={cardItem}>{expenseType}</Text>
                        }
                        {
                            showTypes && expenseTypes.map((type, index) => {
                                return(
                                    <Pressable key={index} onPress={()=>selectType(type)}>      
                                        <Text className={cardItem}>{type}</Text>
                                    </Pressable>
                                )
                            })
                        }
                    </View>

                    <View className={`${card} `}>
                        <Pressable className="flex flex-row justify-between items-center" onPress={()=>setShowSources(true)}>
                            <Text className={cardTitle }>Fuente de pago</Text>
                            <View className="pr-4">
                                <AntDesign name="down" size={24} color="black" />
                            </View>
                        </Pressable>
                        {
                            !showSources && <Text className={cardItem}>{paySource}</Text>
                        }
                        {
                            showSources && paySources.map((source, index) => {
                                return(
                                    <Pressable key={index} onPress={()=>selectSource(source)}>      
                                        <Text className={cardItem}>{source}</Text>
                                    </Pressable>
                                )
                            })
                        }
                    </View>

                    <Pressable className={`${card} w-3/4`} onPress={startCamera}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className={cardTitle}>Foto Ticket / Factura</Text>
                            <View className='mr-4'>
                                <EvilIcons name="camera" size={32} color="black" />
                            </View>
                        </View>
                    </Pressable>

                </ScrollView>
            }
        </>
    )
}

function TypeItem({expenseType, setExpenseType}:{expenseType:ExpenseType, setExpenseType:(expenseType:ExpenseType)=>void}){
    function navigate(){

        setExpenseType(expenseType)
    }
    
    return(
        <>
            <Pressable onPress={navigate}>      
                    <Text className={cardItem}>{expenseType}</Text>
            </Pressable>

        </>
    )
}