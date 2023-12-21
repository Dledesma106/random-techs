import { Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';
import { RootStackParamList, RootTabParamList } from './types';

import AccountSettings from '@/screens/AccountSettings';
import ExpenseOnTask from '@/screens/ExpenseOnTask';
import FullScreenCameraScreen from '@/screens/FullScreenCamera';
import ProfileScreen from '@/screens/Profile';
import RegisterExpenseOnTask from '@/screens/RegisterExpenseOnTask';
import RegisterTask from '@/screens/RegisterTask';
import RegisterTaskBranchFieldScreen from '@/screens/RegisterTask/RegisterTaskBranchFieldScreen';

import { useUserContext } from '../context/userContext/useUser';
import Home from '../screens/Home';
import Login from '../screens/Login';
import NotFoundScreen from '../screens/NotFoundScreen';
import Task from '../screens/Task';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const { user } = useUserContext();

    return (
        <Stack.Navigator initialRouteName={'Login'}>
            <Stack.Screen
                name="FullScreenCamera"
                component={FullScreenCameraScreen}
                options={{ headerShown: false, title: 'Inicio' }}
            />

            <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{ headerShown: false, headerTitle: user?.fullName || 'Random' }}
            />

            <Stack.Screen
                name="NotFound"
                component={NotFoundScreen}
                options={{ title: 'Oops!' }}
            />

            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="RegisterExpenseOnTask"
                component={RegisterExpenseOnTask}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ExpenseOnTask"
                component={ExpenseOnTask}
                options={{ title: 'Gasto' }}
            />

            <Stack.Screen
                name="RegisterTaskBranchFieldScreen"
                component={RegisterTaskBranchFieldScreen}
                options={{
                    title: 'Sucursales',
                }}
            />

            <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{ title: 'Cuenta' }}
            />
        </Stack.Navigator>
    );
}

const Drawer = createDrawerNavigator<RootStackParamList>();

function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerTintColor: '#000',
                headerStyle: {
                    backgroundColor: '#fff',
                },
            }}
            initialRouteName="Home"
        >
            <Drawer.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ title: 'Random', headerTitleAlign: 'center' }}
            />

            <Drawer.Screen
                name="RegisterTask"
                component={RegisterTask}
                options={{ title: 'Registrar una tarea' }}
            />
        </Drawer.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = () => (
    <BottomTab.Navigator initialRouteName="Main">
        <BottomTab.Screen
            name="Main"
            component={Home}
            options={() => ({
                tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
                headerShown: false,
                title: 'Inicio',
            })}
        />

        <BottomTab.Screen
            name="Task"
            component={Task}
            options={{ tabBarItemStyle: { display: 'none' }, headerShown: false }}
        />

        <BottomTab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
        />
    </BottomTab.Navigator>
);
