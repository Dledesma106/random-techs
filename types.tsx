/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { DrawerScreenProps } from '@react-navigation/drawer'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	//Root: NavigatorScreenParams<RootTabParamList> | undefined;
	//Modal: undefined;
	Root: undefined
	Drawer: DrawerScreenProps<DrawerParamList>
	NotFound: undefined
	Home: undefined
	Login: undefined
}

export type DrawerParamList = {
	Home: undefined
	RegisterExpense: undefined
	RegisterTask: undefined
	History: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>

export type RootTabParamList = {
	Task: undefined
	RegisterExpenseOnTask: undefined
	Main: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<RootTabParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>
