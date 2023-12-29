/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Entypo } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'
import { useUser } from '../hooks/useUser'
import NotFoundScreen from '../screens/NotFoundScreen'
import Login from '../screens/Login'
import Home from '../screens/Home'
import { DrawerParamList, RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import { createDrawerNavigator } from '@react-navigation/drawer'
import RegisterTask from '../screens/RegisterTask'
import RegisterExpense from '../screens/RegisterExpense'
import Task from '../screens/Task'
import RegisterExpenseOnTask from '../screens/RegisterExpenseOnTask'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	return (
		<NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	)
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
	const { user } = useUser()

	return (
		<Stack.Navigator initialRouteName="Login">
			<Stack.Screen
				name="Drawer"
				component={DrawerNavigator}
				options={{ headerShown: false, headerTitle: user.fullName }}
			/>
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
			<Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
		</Stack.Navigator>
	)
}

const Drawer = createDrawerNavigator<DrawerParamList>()

function DrawerNavigator() {
	return (
		<Drawer.Navigator initialRouteName="Home">
			<Drawer.Screen
				name="Home"
				component={BottomTabNavigator}
				options={{ title: 'Random', headerTitleAlign: 'center' }}
			/>
			<Drawer.Screen name="RegisterExpense" component={RegisterExpense} options={{ title: 'Registrar un gasto' }} />
			<Drawer.Screen name="RegisterTask" component={RegisterTask} options={{ title: 'Registrar una tarea' }} />
		</Drawer.Navigator>
	)
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
	//const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator initialRouteName="Main">
			<BottomTab.Screen
				name="Main"
				component={Home}
				options={({ navigation }: RootTabScreenProps<'Main'>) => ({
					tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
					headerShown: false,
					title: 'Inicio'
				})}
			/>
			<BottomTab.Screen
				name="Task"
				component={Task}
				options={{ tabBarItemStyle: { display: 'none' }, headerShown: false }}
			/>
			<BottomTab.Screen
				name="RegisterExpenseOnTask"
				component={RegisterExpenseOnTask}
				options={{ tabBarItemStyle: { display: 'none' }, headerShown: false }}
			/>
		</BottomTab.Navigator>
	)
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
/* function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
 */
