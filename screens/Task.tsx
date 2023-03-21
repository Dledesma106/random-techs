import { Pressable, Text, View, ScrollView } from "react-native";
import { IExpense, ITask } from "../models/interfaces";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react"
import { Entypo } from '@expo/vector-icons';
import { dmyDateString } from "../lib/utils";
import Input from "../components/Forms/Input";
import { AntDesign } from '@expo/vector-icons';
import { useDB } from "../hooks/useDB";
import DatePicker from 'react-native-modern-datepicker'
import { card, cardItem, cardTitle } from "../styles";
import { EvilIcons } from '@expo/vector-icons';

export default function Task({route, navigation}:{route:any, navigation:any}){
    const {task} = route.params
    const {getTaskExpenses} = useDB()
    const [taskExpenses, setTaskExpenses] = useState<IExpense[]>([])
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<ITask>({
        ...task,
        closedAt:new Date(),
        workOrderNumber: NaN,
    })

    useEffect(()=>{
        async function getExpenses(){
            setTaskExpenses(await getTaskExpenses(task._id))
        }
        getExpenses()
    }, [])

    function pickDate(pickedDate: string){
        setCurrentTask(prev => ({...prev, closedAt:new Date(pickedDate)}))
        setShowDatePicker(false)
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

    return(
        <>
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
                    <Text className={cardTitle}>Seleccionar fecha de cierre</Text>
                    <Pressable onPress={()=>{setShowDatePicker(true)}}>
                        <View className="flex flex-row justify-evenly border-t-2 items-center">
                            <Text className={cardTitle}>{dmyDateString(currentTask.closedAt as Date)}</Text>
                            <Entypo name="calendar" size={24} color="black" />
                        </View>
                    </Pressable>
                    {
                        showDatePicker &&
                        <DatePicker
                            onSelectedChange={pickDate}
                            minimumDate={new Date(task.openedAt).toJSON()}
                            maximumDate={new Date().toJSON()}
                            mode='calendar'
                        />
                    }

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
                


            </ScrollView>
            
        </>
    )
}