import { Text, View } from "react-native";

interface ExpenseForm {

}

export default function RegisterExpenseOnTask({route}:{route:any}){
    const {taskId} = route.params

    return (
        <>
            <View className="flex items-center justify-center h-screen">

                <Text className="text-blue-400">
                    Registrate un gasto en la tarea
                </Text>
            </View>
        </>
    )
}
