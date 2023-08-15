import { Text, ScrollView } from 'react-native'
import TasksList from '../components/Lists/TasksList'
export default function Home({ navigation }: { navigation: any }) {
	return (
		<>
			<ScrollView className="bg-gray-300 h-screen">
				<TasksList navigation={navigation} />
				<Text className="text-lg">Aca van las actividades(veremos qsi lo ponemos en la primera entrega)</Text>
				<Text className="text-lg">
					despues un historial de las ultimas cosas que se hicieron(va a tener que ser un listado en la db)
				</Text>
			</ScrollView>
		</>
	)
}
