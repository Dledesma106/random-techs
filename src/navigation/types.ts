import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

import { ExpenseInput } from '@/screens/Task';
import { BranchesQuery, BusinessesQuery, TaskType } from '@/api/graphql';

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
    RegisterExpenseOnTask: {
        taskId: string;
    };
    Expense: {
        expenseId: string;
    };
    ExpenseOnTaskForm: {
        expense: ExpenseInput;
    };
    FullScreenCamera: undefined;
    FullScreenImage: { uri: string };
    RegisterTask: {
        branch?: BranchesQuery['branches'][0] | null;
        business?: BusinessesQuery['businesses'][0] | null;
        type?: TaskType | null;
    };
    RegisterTaskBranchFieldScreen: {
        value: string | null;
    };
    RegisterTaskBusinessFieldScreen: {
        branchId: string;
        value: string | null;
    };
    RegisterTaskTypeFieldScreen: {
        value: TaskType | null;
    };
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

export type RegisterTaskBranchFieldScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterTaskBranchFieldScreen'
>;
export type RegisterTaskBusinessFieldScreenRouteProps = NativeStackScreenProps<
    RootStackParamList,
    'RegisterTaskBusinessFieldScreen'
>;
export type RegisterTaskTypeFieldScreenRouteProps = NativeStackScreenProps<
    RootStackParamList,
    'RegisterTaskTypeFieldScreen'
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
