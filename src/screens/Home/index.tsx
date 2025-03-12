// import ActivityList from './ActivityList';
import { View } from 'react-native';

import TasksList from './TasksList';

import ThemeToggle from '@/components/ThemeToggle';
import { HomeTabScreenProp } from '@/navigation/types';

const Home = ({ navigation }: HomeTabScreenProp) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10, alignItems: 'flex-end' }}>
                <ThemeToggle />
            </View>
            <TasksList navigation={navigation} />
        </View>
    );
};

export default Home;
