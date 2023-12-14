import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

import { IExpense, ITask } from '@/models/interfaces';

export type RootStackParamList = {
    Root: undefined;
    Drawer: undefined;
    NotFound: undefined;
    Home: undefined;
    Login: undefined;
    Task: {
        task: ITask;
    };
    RegisterExpenseOnTask: {
        task: ITask;
    };
    Expense: {
        expense: IExpense;
    };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
    RootStackParamList,
    T
>;

export type HomeTabScreenProp = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Main'>,
    RootStackScreenProps<'Home'>
>;

export type TaskScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Task'>;
export type RegisterExpenseOnTaskScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'RegisterExpenseOnTask'
>;

export type ExpenseScreenRouteProp = NativeStackScreenProps<
    RootStackParamList,
    'Expense'
>;

export type HomeScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type RootTabParamList = {
    Main: RootStackParamList['Home'];
    Task: RootStackParamList['Task'];
    RegisterExpenseOnTask: RootStackParamList['RegisterExpenseOnTask'];
};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
