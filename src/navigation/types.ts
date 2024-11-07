import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

import { ExpenseInput } from '@/screens/Task';

export type RootStackParamList = {
    Root: undefined;
    Drawer: undefined;
    NotFound: undefined;
    Home: undefined;
    RegisterExpense: undefined;
    ExpensesList: undefined;
    Login: undefined;
    Task: {
        id: string;
    };
    RegisterExpenseOnTask: undefined;
    Expense: {
        expenseId: string;
    };
    ExpenseOnTaskForm: {
        expense: ExpenseInput;
    };
    FullScreenCamera: undefined;
    FullScreenImage: { uri: string };
    RegisterTask: undefined;
    AccountSettings: undefined;
    Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
    RootStackParamList,
    T
>;

export type HomeTabScreenProp = RootStackScreenProps<'Home'>;

export type RegisterTaskScreenProp = RootStackScreenProps<'RegisterTask'>;
export type ExpensesListScreenProp = RootStackScreenProps<'ExpensesList'>;
export type FullScreenCameraProps = RootStackScreenProps<'FullScreenCamera'>;

export type TaskScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Task'>;
export type RegisterTaskScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterTask'
>;
export type FullScreenImageProp = NativeStackScreenProps<
    RootStackParamList,
    'FullScreenImage'
>;
export type RegisterExpenseOnTaskScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterExpenseOnTask'
>;
export type RegisterExpenseScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterExpense'
>;

export type ExpenseScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'Expense'
>;

export type ExpenseOnTaskFormScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'ExpenseOnTaskForm'
>;

export type HomeScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ProfileScreenRouteProp = CompositeScreenProps<
    RootStackScreenProps<'Profile'>,
    NativeStackScreenProps<RootTabParamList, 'Profile'>
>;

export type AccountSettingsScreenRouteProps = NativeStackScreenProps<
    RootStackParamList,
    'AccountSettings'
>;

export type RootTabParamList = {
    Profile: undefined;
    Main: RootStackParamList['Home'];
    Task: RootStackParamList['Task'];
    RegisterExpenseOnTask: RootStackParamList['RegisterExpenseOnTask'];
    AccountSettings: undefined;
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
