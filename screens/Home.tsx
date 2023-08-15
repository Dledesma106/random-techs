import { Text, View, ScrollView } from "react-native"
import TasksList from "../components/Lists/TasksList"
import ActivityList from "../components/Lists/ActivityList"
export default function Home({navigation}:{navigation:any}){
    
    return(
        <>
        <ScrollView className="bg-gray-300 h-screen">
            
            <TasksList navigation={navigation}/>
            <ActivityList navigation={navigation}/>
            <Text className="text-lg">despues un historial de las ultimas cosas que se hicieron(va a tener que ser un listado en la db)</Text>
        </ScrollView>
        </>
    )
}
