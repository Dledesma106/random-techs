import { Text, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import ActivityList from './ActivityList';
import TasksList from './TasksList';

import { HomeTabScreenProp } from '@/navigation/types';

const Home = ({ navigation }: HomeTabScreenProp) => (
    <ScrollView className="bg-gray-300 h-screen">
        <TasksList navigation={navigation} />
        {/* <ActivityList navigation={navigation} /> */}

        <Text className="text-lg">
            despues un historial de las ultimas cosas que se hicieron (va a tener que ser
            un listado en la db)
        </Text>
    </ScrollView>
);

export default Home;
