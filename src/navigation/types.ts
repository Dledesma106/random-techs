import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
    Root: undefined;
    Drawer: undefined;
    NotFound: undefined;
    Home: undefined;
    Login: undefined;
    Task: {
        id: string;
    };
    RegisterExpenseOnTask: {
        taskId: string;
    };
    ExpenseOnTask: {
        expenseId: string;
    };
    FullScreenCamera: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
    RootStackParamList,
    T
>;

export type HomeTabScreenProp = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Main'>,
    RootStackScreenProps<'Home'>
>;

export type FullScreenCameraProps = RootStackScreenProps<'FullScreenCamera'>;

export type TaskScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Task'>;
export type RegisterExpenseOnTaskScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterExpenseOnTask'
>;

export type ExpenseOnTaskScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'ExpenseOnTask'
>;

export type HomeScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type ProfileScreenRouteProp = NativeStackScreenProps<RootTabParamList, 'Profile'>;

export type RootTabParamList = {
    Main: RootStackParamList['Home'];
    Task: RootStackParamList['Task'];
    Profile: undefined;
    RegisterExpenseOnTask: RootStackParamList['RegisterExpenseOnTask'];
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
