// import ActivityList from './ActivityList';
import TasksList from './TasksList';

import { HomeTabScreenProp } from '@/navigation/types';

const Home = ({ navigation }: HomeTabScreenProp) => {
    return <TasksList navigation={navigation} />;
};

export default Home;
