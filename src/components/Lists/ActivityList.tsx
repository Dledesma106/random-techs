import { Feather, AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, View, Pressable, TouchableOpacity } from 'react-native';

import { useDb } from '../../hooks/useDB';
import { IActivity } from '../../models/interfaces';
//import fetcher from '../../lib/fetcher';
//import * as apiEndpoints from "../../lib/apiEndpoints";
//import Activity from "../../models/Activity";
import FormActivities from '../Forms/FormActivities';
//import moment from "moment";

export default function ActivityList({ navigation }: { navigation: any }) {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const { getActivities } = useDb();

    const getAllActivities = async () => {
        const activities = await getActivities();
        setActivities(activities);
    };

    const [showForm, setShowForm] = useState(false);
    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const refresh = async () => {
        await getAllActivities();
    };
    useEffect(() => {
        getAllActivities();
    }, [activities]); //* Para que actualice cuando se agrega una activity

    const card = 'flex flex-col w-11/12 mx-auto my-4 bg-gray-50 rounded-3xl';

    return (
        <>
            <View className={card}>
                <Header
                    title={activities ? 'Actividades:' : 'No hay actividades'}
                    refresh={refresh}
                />
                {activities.map((activity, index) => (
                    <Item navigation={navigation} key={index} activity={activity} />
                ))}
                <TouchableOpacity
                    className="flex justify-center items-center text-center"
                    onPress={toggleFormVisibility}
                >
                    <Text>Crear Actividad</Text>
                </TouchableOpacity>
                {showForm && <FormActivities />}
            </View>
        </>
    );
}

function Header({ title, refresh }: { title: string; refresh: () => void }) {
    return (
        <View className="flex flex-row items-center justify-between p-4 rounded-t-3xl">
            <Text className="text-lg">{title}</Text>
            <Pressable onPress={refresh}>
                <Feather name="refresh-cw" size={20} color="black" />
            </Pressable>
        </View>
    );
}

function Item({ activity, navigation }: { activity: IActivity; navigation: any }) {
    function navigate() {
        navigation.navigate('Activity', { activity });
    }
    return (
        <>
            <Pressable onPress={navigate}>
                <View className="flex flex-row border-t-2 items-center justify-between p-2">
                    <View className={'flex flex-col p-2 w-3/4'}>
                        <Text>{activity.name}</Text>
                        <Text>{activity.description}</Text>
                    </View>
                    <AntDesign name="right" size={24} color="black" />
                </View>
            </Pressable>
        </>
    );
}
