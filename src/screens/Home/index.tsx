import { RefreshControl, ScrollView } from 'react-native';

// import ActivityList from './ActivityList';
import TasksList from './TasksList';
import { useTasksListQuery } from './TasksList/queries';

import { TaskStatus } from '@/models/types';
import { HomeTabScreenProp } from '@/navigation/types';

const Home = ({ navigation }: HomeTabScreenProp) => {
    const tasksQuery = useTasksListQuery({
        status: TaskStatus.Pendiente,
    });

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={tasksQuery.fetchStatus === 'fetching'}
                    onRefresh={tasksQuery.refetch}
                />
            }
            className="bg-slate-100 h-screen"
        >
            <TasksList navigation={navigation} tasksQuery={tasksQuery} />
            {/* <ActivityList navigation={navigation} /> */}

            {/* <Text className="text-lg">
            despues un historial de las ultimas cosas que se hicieron (va a tener que ser
            un listado en la db)
        </Text> */}
        </ScrollView>
    );
};

export default Home;
