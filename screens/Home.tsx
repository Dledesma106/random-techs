import { Text, View } from "react-native"
import TasksList from "../components/Lists/TasksList"
export default function Home(){
    return(
        <>
            <View>
                <Text className="text-lg">Tareas pendientes</Text>
                <TasksList/>
            </View>
            <Text className="text-lg">Aca van las actividades(veremos qsi lo ponemos en la primera entrega)</Text>
            <Text className="text-lg">despues un historial de las ultimas cosas que se hicieron(va a tener que ser un listado en la db)</Text>
        </>
    )
}