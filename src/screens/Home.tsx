import { Text, ScrollView } from 'react-native';

import { HomeTabScreenProp } from '@/navigation/types';

import ActivityList from '../components/Lists/ActivityList';
import TasksList from '../components/Lists/TasksList';

const Home = ({ navigation }: HomeTabScreenProp) => (
    <ScrollView className="bg-gray-300 h-screen">
        <TasksList navigation={navigation} />
        <ActivityList navigation={navigation} />
        <Text className="text-lg">
            despues un historial de las ultimas cosas que se hicieron (va a tener que ser
            un listado en la db)
        </Text>
    </ScrollView>
);

export default Home;
