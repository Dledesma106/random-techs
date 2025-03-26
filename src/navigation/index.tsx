import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LinkingConfiguration from './LinkingConfiguration';
import { RootStackParamList } from './types';

import AccountSettings from '@/screens/AccountSettings';
import Expense from '@/screens/Expense';
import ExpenseOnTaskForm from '@/screens/ExpenseOnTaskForm';
import ExpensesList from '@/screens/ExpensesList';
import FullScreenCameraScreen from '@/screens/FullScreenCamera';
import FullScreenImageScreen from '@/screens/FullScreenImage';
import ProfileScreen from '@/screens/Profile';
import RegisterExpense from '@/screens/RegisterExpense';
import RegisterExpenseOnTask from '@/screens/RegisterExpenseOnTask';
import RegisterTask from '@/screens/RegisterTask';

import { useUserContext } from '../context/userContext/useUser';
import AssignedTask from '../screens/AssignedTask';
import Home from '../screens/Home';
import Login from '../screens/Login';
import NotFoundScreen from '../screens/NotFoundScreen';
import ThemeTest from '../screens/ThemeTest';

export default function Navigation() {
    const { colorScheme } = useColorScheme();
    return (
        <GestureHandlerRootView>
            <NavigationContainer
                linking={LinkingConfiguration}
                theme={colorScheme === 'light' ? DefaultTheme : DarkTheme}
            >
                <StatusBar style="dark" />
                <RootNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const { user } = useUserContext();

    return (
        <Stack.Navigator initialRouteName={user ? 'Drawer' : 'Login'}>
            <Stack.Screen
                name="FullScreenCamera"
                component={FullScreenCameraScreen}
                options={{ headerShown: false, title: 'Inicio' }}
            />

            <Stack.Screen
                name="FullScreenImage"
                component={FullScreenImageScreen}
                options={{ headerShown: false }}
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
                name="Expense"
                component={Expense}
                options={{ title: 'Gasto' }}
            />

            <Stack.Screen
                name="ExpenseOnTaskForm"
                component={ExpenseOnTaskForm}
                options={{ title: 'Gasto' }}
            />

            <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
                options={{ title: 'Cuenta' }}
            />
            <Stack.Screen
                name="AssignedTask"
                component={AssignedTask}
                options={{ title: 'Tarea Asignada' }}
            />
            <Stack.Screen
                name="RegisterExpense"
                component={RegisterExpense}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ThemeTest"
                component={ThemeTest}
                options={{ title: 'Prueba de Tema' }}
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
                component={Home}
                options={{ title: 'Tareas Asignadas', headerTitleAlign: 'center' }}
            />

            <Drawer.Screen
                name="ExpensesList"
                component={ExpensesList}
                options={{ title: 'Mis gastos', headerTitleAlign: 'center' }}
            />

            <Drawer.Screen
                name="RegisterTask"
                component={RegisterTask}
                options={{ title: 'Registrar una tarea' }}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={() => ({
                    title: 'Mi perfil',
                })}
            />
        </Drawer.Navigator>
    );
}

/* const BottomTab = createBottomTabNavigator<RootTabParamList>();

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
            name="Profile"
            component={ProfileScreen}
            options={() => ({
                tabBarIcon: () => <Entypo name="user" size={24} color="black" />,
                headerShown: false,
            })}
        />
    </BottomTab.Navigator>
);
 */
