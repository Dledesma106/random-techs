import { RefreshControl, ScrollView } from 'react-native';

// import ActivityList from './ActivityList';
import TasksList from './TasksList';

import { useGetMyAssignedTasks } from '@/hooks/api/tasks/useGetMyAssignedTasks';
import { HomeTabScreenProp } from '@/navigation/types';

const Home = ({ navigation }: HomeTabScreenProp) => {
    const tasksQuery = useGetMyAssignedTasks();

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={tasksQuery.fetchStatus === 'fetching'}
                    onRefresh={tasksQuery.refetch}
                />
            }
            className="bg-white flex-1"
        >
            <TasksList navigation={navigation} tasksQuery={tasksQuery} />
        </ScrollView>
    );
};

export default Home;
