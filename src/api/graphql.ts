import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    DateTime: any;
    JSON: any;
};

export type Branch = {
    __typename?: 'Branch';
    businesses: Array<Business>;
    city: City;
    client: Client;
    id: Scalars['ID'];
    number: Scalars['Int'];
};

export type BranchCrudResult = {
    __typename?: 'BranchCrudResult';
    branch: Maybe<Branch>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BranchInput = {
    businessesIds: Array<Scalars['String']>;
    cityId: Scalars['String'];
    clientId: Scalars['String'];
    number: Scalars['Int'];
};

export type Business = {
    __typename?: 'Business';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type City = {
    __typename?: 'City';
    id: Scalars['ID'];
    name: Scalars['String'];
    province: Province;
};

export type CityCrudResult = {
    __typename?: 'CityCrudResult';
    city: Maybe<City>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type CityInput = {
    name: Scalars['String'];
    provinceId: Scalars['String'];
};

export type Client = {
    __typename?: 'Client';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type Expense = {
    __typename?: 'Expense';
    amount: Scalars['Int'];
    auditor: Maybe<User>;
    createdAt: Scalars['DateTime'];
    doneBy: User;
    expenseType: ExpenseType;
    id: Scalars['ID'];
    image: Image;
    paySource: ExpensePaySource;
    status: ExpenseStatus;
};

export type ExpenseCrudResult = {
    __typename?: 'ExpenseCrudResult';
    expense: Maybe<Expense>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type ExpenseInput = {
    amount: Scalars['Int'];
    expenseType: ExpenseType;
    imageKey: Scalars['String'];
    paySource: ExpensePaySource;
};

export const ExpensePaySource = {
    Reintegro: 'Reintegro',
    Tarjeta: 'Tarjeta',
} as const;

export type ExpensePaySource = (typeof ExpensePaySource)[keyof typeof ExpensePaySource];
export const ExpenseStatus = {
    Aprobado: 'Aprobado',
    Enviado: 'Enviado',
    Rechazado: 'Rechazado',
} as const;

export type ExpenseStatus = (typeof ExpenseStatus)[keyof typeof ExpenseStatus];
export const ExpenseType = {
    Combustible: 'Combustible',
    Comida: 'Comida',
    Herramienta: 'Herramienta',
    Hospedaje: 'Hospedaje',
    Insumos: 'Insumos',
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];
export type Image = {
    __typename?: 'Image';
    id: Scalars['ID'];
    key: Scalars['String'];
    url: Scalars['String'];
    urlExpire: Maybe<Scalars['DateTime']>;
};

export type LoginUserResult = {
    __typename?: 'LoginUserResult';
    accessToken: Maybe<Scalars['String']>;
    expiresAt: Maybe<Scalars['DateTime']>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type Mutation = {
    __typename?: 'Mutation';
    createBranch: BranchCrudResult;
    createCity: CityCrudResult;
    createExpenseOnTask: ExpenseCrudResult;
    createPreventive: PreventiveCrudResult;
    createTask: TaskCrudResult;
    createUser: UserCrudPothosRef;
    deleteBranch: BranchCrudResult;
    deleteCity: CityCrudResult;
    deleteExpense: ExpenseCrudResult;
    deleteImage: TaskCrudResult;
    deletePreventive: PreventiveCrudResult;
    deleteTask: TaskCrudResult;
    login: LoginUserResult;
    sendNewUserRandomPassword: UserCrudPothosRef;
    updateBranch: BranchCrudResult;
    updateCity: CityCrudResult;
    updateMyAssignedTask: TaskCrudResult;
    updatePreventive: PreventiveCrudResult;
    updateTask: TaskCrudResult;
    updateTaskExpenseStatus: TaskCrudResult;
    updateUser: UserCrudPothosRef;
};

export type MutationCreateBranchArgs = {
    input: BranchInput;
};

export type MutationCreateCityArgs = {
    input: CityInput;
};

export type MutationCreateExpenseOnTaskArgs = {
    expenseData: ExpenseInput;
    taskId: Scalars['String'];
};

export type MutationCreatePreventiveArgs = {
    data: PreventiveInput;
};

export type MutationCreateTaskArgs = {
    input: TaskInput;
};

export type MutationCreateUserArgs = {
    input: UserInput;
};

export type MutationDeleteBranchArgs = {
    id: Scalars['String'];
};

export type MutationDeleteCityArgs = {
    id: Scalars['String'];
};

export type MutationDeleteExpenseArgs = {
    id: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeleteImageArgs = {
    imageId: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeletePreventiveArgs = {
    id: Scalars['String'];
};

export type MutationDeleteTaskArgs = {
    id: Scalars['String'];
};

export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};

export type MutationSendNewUserRandomPasswordArgs = {
    id: Scalars['String'];
};

export type MutationUpdateBranchArgs = {
    id: Scalars['String'];
    input: BranchInput;
};

export type MutationUpdateCityArgs = {
    id: Scalars['String'];
    input: CityInput;
};

export type MutationUpdateMyAssignedTaskArgs = {
    input: UpdateMyTaskInput;
};

export type MutationUpdatePreventiveArgs = {
    data: PreventiveInput;
    id: Scalars['String'];
};

export type MutationUpdateTaskArgs = {
    id: Scalars['String'];
    input: TaskInput;
};

export type MutationUpdateTaskExpenseStatusArgs = {
    expenseId: Scalars['String'];
    status: ExpenseStatus;
};

export type MutationUpdateUserArgs = {
    id: Scalars['String'];
    input: UserInput;
};

export type Preventive = {
    __typename?: 'Preventive';
    assigned: Array<User>;
    assignedIDs: Array<Scalars['String']>;
    batteryChangedAt: Maybe<Scalars['DateTime']>;
    branch: Branch;
    business: Business;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    frequency: Scalars['Int'];
    id: Scalars['ID'];
    lastDoneAt: Maybe<Scalars['DateTime']>;
    months: Array<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    status: PreventiveStatus;
    updatedAt: Scalars['DateTime'];
};

export type PreventiveCrudResult = {
    __typename?: 'PreventiveCrudResult';
    message: Maybe<Scalars['String']>;
    preventive: Maybe<Preventive>;
    success: Scalars['Boolean'];
};

export type PreventiveInput = {
    assignedIDs: Array<Scalars['String']>;
    branchId: Scalars['String'];
    businessId: Scalars['String'];
    frequency: Scalars['Int'];
    months: Array<Scalars['String']>;
    observations: InputMaybe<Scalars['String']>;
    status: PreventiveStatus;
};

export const PreventiveStatus = {
    AlDia: 'AlDia',
    Pendiente: 'Pendiente',
} as const;

export type PreventiveStatus = (typeof PreventiveStatus)[keyof typeof PreventiveStatus];
export type Province = {
    __typename?: 'Province';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type Query = {
    __typename?: 'Query';
    branches: Array<Branch>;
    branchesOfClient: Array<Branch>;
    businesses: Array<Business>;
    cities: Array<City>;
    images: Array<Image>;
    myAssignedTaskById: Maybe<Task>;
    myAssignedTaskExpenseById: Maybe<Expense>;
    myAssignedTasks: Array<Task>;
    preventives: Array<Preventive>;
    provinces: Array<Province>;
    taskById: Maybe<Task>;
    tasks: Array<Task>;
    users: Array<User>;
};

export type QueryBranchesOfClientArgs = {
    businessId: InputMaybe<Scalars['String']>;
    cityId: InputMaybe<Scalars['String']>;
    clientId: Scalars['String'];
    provinceId: InputMaybe<Scalars['String']>;
};

export type QueryBusinessesArgs = {
    branch: InputMaybe<Scalars['String']>;
};

export type QueryMyAssignedTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryMyAssignedTaskExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryTasksArgs = {
    assigneed: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Scalars['String']>;
    city: InputMaybe<Scalars['String']>;
    client: InputMaybe<Scalars['String']>;
    status: InputMaybe<TaskStatus>;
    taskType: InputMaybe<TaskType>;
};

export const Role = {
    AdministrativoContable: 'AdministrativoContable',
    AdministrativoTecnico: 'AdministrativoTecnico',
    Auditor: 'Auditor',
    Tecnico: 'Tecnico',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
export type Task = {
    __typename?: 'Task';
    assigned: Array<User>;
    auditor: Maybe<User>;
    branch: Branch;
    business: Business;
    closedAt: Maybe<Scalars['DateTime']>;
    createdAt: Scalars['DateTime'];
    description: Scalars['String'];
    expenses: Array<Expense>;
    id: Scalars['ID'];
    images: Array<Image>;
    imagesIDs: Array<Scalars['String']>;
    metadata: Scalars['JSON'];
    status: TaskStatus;
    taskType: TaskType;
    workOrderNumber: Maybe<Scalars['Int']>;
};

export type TaskCrudResult = {
    __typename?: 'TaskCrudResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    task: Maybe<Task>;
};

export type TaskInput = {
    assigned: Array<Scalars['String']>;
    auditor: InputMaybe<Scalars['String']>;
    branch: Scalars['String'];
    business: Scalars['String'];
    description: Scalars['String'];
    metadata: Scalars['JSON'];
    status: TaskStatus;
    taskType: TaskType;
    workOrderNumber: InputMaybe<Scalars['Int']>;
};

export const TaskStatus = {
    Aprobada: 'Aprobada',
    Finalizada: 'Finalizada',
    Pendiente: 'Pendiente',
    SinAsignar: 'SinAsignar',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export const TaskType = {
    Actualizacion: 'Actualizacion',
    Correctivo: 'Correctivo',
    Desmonte: 'Desmonte',
    Instalacion: 'Instalacion',
    Preventivo: 'Preventivo',
} as const;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];
export type UpdateMyTaskInput = {
    id: Scalars['String'];
    imageKeys: Array<Scalars['String']>;
    workOrderNumber: Scalars['String'];
};

export type User = {
    __typename?: 'User';
    city: Maybe<City>;
    email: Scalars['String'];
    firstName: Scalars['String'];
    fullName: Scalars['String'];
    id: Scalars['ID'];
    lastName: Scalars['String'];
    roles: Array<Role>;
};

export type UserCrudPothosRef = {
    __typename?: 'UserCrudPothosRef';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type UserInput = {
    city: Scalars['String'];
    email: Scalars['String'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    roles: Array<Role>;
};

export type LoginMutationVariables = Exact<{
    email: Scalars['String'];
    password: Scalars['String'];
}>;

export type LoginMutation = {
    __typename?: 'Mutation';
    login: {
        __typename?: 'LoginUserResult';
        success: boolean;
        message: string | null;
        accessToken: string | null;
        expiresAt: any | null;
        user: {
            __typename?: 'User';
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            fullName: string;
            roles: Array<Role>;
        } | null;
    };
};

export type BranchesQueryVariables = Exact<{ [key: string]: never }>;

export type BranchesQuery = {
    __typename?: 'Query';
    branches: Array<{
        __typename?: 'Branch';
        id: string;
        number: number;
        client: { __typename?: 'Client'; name: string };
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        };
        businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
    }>;
};

export type BusinessesQueryVariables = Exact<{
    branch: InputMaybe<Scalars['String']>;
}>;

export type BusinessesQuery = {
    __typename?: 'Query';
    businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
};

export type MyAssignedTaskExpenseByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type MyAssignedTaskExpenseByIdQuery = {
    __typename?: 'Query';
    myAssignedTaskExpenseById: {
        __typename?: 'Expense';
        id: string;
        amount: number;
        expenseType: ExpenseType;
        paySource: ExpensePaySource;
        status: ExpenseStatus;
        createdAt: any;
        image: { __typename?: 'Image'; id: string; url: string };
        auditor: { __typename?: 'User'; id: string; fullName: string } | null;
    } | null;
};

export type CreateExpenseOnTaskMutationVariables = Exact<{
    taskId: Scalars['String'];
    expenseData: ExpenseInput;
}>;

export type CreateExpenseOnTaskMutation = {
    __typename?: 'Mutation';
    createExpenseOnTask: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            id: string;
            image: { __typename?: 'Image'; id: string; url: string; key: string };
        } | null;
    };
};

export type DeleteExpenseMutationVariables = Exact<{
    id: Scalars['String'];
    taskId: Scalars['String'];
}>;

export type DeleteExpenseMutation = {
    __typename?: 'Mutation';
    deleteExpense: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: { __typename?: 'Expense'; id: string } | null;
    };
};

export type MyAssignedTasksQueryVariables = Exact<{ [key: string]: never }>;

export type MyAssignedTasksQuery = {
    __typename?: 'Query';
    myAssignedTasks: Array<{
        __typename?: 'Task';
        id: string;
        createdAt: any;
        closedAt: any | null;
        description: string;
        taskType: TaskType;
        status: TaskStatus;
        business: { __typename?: 'Business'; id: string; name: string };
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number;
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string };
        };
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        expenses: Array<{ __typename?: 'Expense'; amount: number }>;
    }>;
};

export type MyAssignedTaskByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type MyAssignedTaskByIdQuery = {
    __typename?: 'Query';
    myAssignedTaskById: {
        __typename?: 'Task';
        id: string;
        createdAt: any;
        closedAt: any | null;
        description: string;
        workOrderNumber: number | null;
        taskType: TaskType;
        status: TaskStatus;
        business: { __typename?: 'Business'; id: string; name: string };
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        auditor: { __typename?: 'User'; fullName: string } | null;
        branch: {
            __typename?: 'Branch';
            number: number;
            city: {
                __typename?: 'City';
                name: string;
                province: { __typename?: 'Province'; name: string };
            };
            client: { __typename?: 'Client'; name: string };
        };
        assigned: Array<{
            __typename?: 'User';
            id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
        }>;
        expenses: Array<{
            __typename?: 'Expense';
            id: string;
            amount: number;
            paySource: ExpensePaySource;
            expenseType: ExpenseType;
            createdAt: any;
            status: ExpenseStatus;
            image: {
                __typename?: 'Image';
                id: string;
                url: string;
                urlExpire: any | null;
                key: string;
            };
            doneBy: { __typename?: 'User'; id: string; email: string; fullName: string };
        }>;
    } | null;
};

export type CreateTaskMutationVariables = Exact<{
    input: TaskInput;
}>;

export type CreateTaskMutation = {
    __typename?: 'Mutation';
    createTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: { __typename?: 'Task'; id: string } | null;
    };
};

export type UpdateMyAssignedTaskMutationVariables = Exact<{
    input: UpdateMyTaskInput;
}>;

export type UpdateMyAssignedTaskMutation = {
    __typename?: 'Mutation';
    updateMyAssignedTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: {
            __typename?: 'Task';
            id: string;
            status: TaskStatus;
            workOrderNumber: number | null;
            images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        } | null;
    };
};

export type DeleteImageMutationVariables = Exact<{
    taskId: Scalars['String'];
    imageId: Scalars['String'];
}>;

export type DeleteImageMutation = {
    __typename?: 'Mutation';
    deleteImage: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: {
            __typename?: 'Task';
            id: string;
            status: TaskStatus;
            workOrderNumber: number | null;
            images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        } | null;
    };
};

export const LoginDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'login' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'email' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'password' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'login' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'email' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'email' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'password' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'password' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'roles' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'accessToken' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiresAt' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const BranchesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'branches' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'branches' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'number' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'client' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'province' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'businesses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BranchesQuery, BranchesQueryVariables>;
export const BusinessesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'businesses' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'branch' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'businesses' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'branch' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'branch' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BusinessesQuery, BusinessesQueryVariables>;
export const MyAssignedTaskExpenseByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'myAssignedTaskExpenseById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'myAssignedTaskExpenseById' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'image' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'auditor' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    MyAssignedTaskExpenseByIdQuery,
    MyAssignedTaskExpenseByIdQueryVariables
>;
export const CreateExpenseOnTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createExpenseOnTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ExpenseInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createExpenseOnTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'taskId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'image' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'url',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'key',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateExpenseOnTaskMutation,
    CreateExpenseOnTaskMutationVariables
>;
export const DeleteExpenseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteExpense' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteExpense' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'taskId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const MyAssignedTasksDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'myAssignedTasks' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'myAssignedTasks' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'closedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'business' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'city' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'province',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'client' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'assigned' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>;
export const MyAssignedTaskByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'myAssignedTaskById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'myAssignedTaskById' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'closedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'business' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'images' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'auditor' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'workOrderNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'city' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'province',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'client' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'assigned' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'paySource',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseType',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'image' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'url',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'urlExpire',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'key',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'doneBy' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'email',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'fullName',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MyAssignedTaskByIdQuery, MyAssignedTaskByIdQueryVariables>;
export const CreateTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'TaskInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateMyAssignedTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateMyAssignedTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'UpdateMyTaskInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateMyAssignedTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'workOrderNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'images' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'url',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    UpdateMyAssignedTaskMutation,
    UpdateMyAssignedTaskMutationVariables
>;
export const DeleteImageDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteImage' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'imageId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteImage' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'taskId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'imageId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'imageId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'workOrderNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'images' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'url',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteImageMutation, DeleteImageMutationVariables>;
