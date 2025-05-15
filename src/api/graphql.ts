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

export type AuthResult = {
    __typename?: 'AuthResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type Branch = {
    __typename?: 'Branch';
    businesses: Array<Business>;
    city: City;
    client: Client;
    id: Scalars['ID'];
    name: Maybe<Scalars['String']>;
    number: Maybe<Scalars['Int']>;
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
    name: InputMaybe<Scalars['String']>;
    number: InputMaybe<Scalars['Int']>;
};

export type Business = {
    __typename?: 'Business';
    branchesIDs: Maybe<Array<Scalars['String']>>;
    createdAt: Scalars['Date'];
    deletedAt: Maybe<Scalars['Date']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type BusinessInput = {
    name: Scalars['String'];
};

export type BusinessResult = {
    __typename?: 'BusinessResult';
    business: Maybe<Business>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type ChangePasswordInput = {
    currentPassword: Scalars['String'];
    newPassword: Scalars['String'];
};

export type City = {
    __typename?: 'City';
    id: Scalars['ID'];
    name: Scalars['String'];
    province: Province;
};

export type CityCrudRef = {
    __typename?: 'CityCrudRef';
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
    branches: Array<Branch>;
    createdAt: Scalars['Date'];
    deletedAt: Maybe<Scalars['Date']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type ClientInput = {
    name: Scalars['String'];
};

export type ClientResult = {
    __typename?: 'ClientResult';
    client: Maybe<Client>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type Expense = {
    __typename?: 'Expense';
    amount: Scalars['Float'];
    auditor: Maybe<User>;
    cityName: Maybe<Scalars['String']>;
    createdAt: Scalars['DateTime'];
    discountAmount: Maybe<Scalars['Float']>;
    doneBy: Scalars['String'];
    expenseDate: Maybe<Scalars['DateTime']>;
    expenseNumber: Scalars['String'];
    expenseType: ExpenseType;
    files: Array<File>;
    id: Scalars['ID'];
    images: Array<Image>;
    installments: Maybe<Scalars['Int']>;
    observations: Maybe<Scalars['String']>;
    paySource: ExpensePaySource;
    paySourceBank: Maybe<ExpensePaySourceBank>;
    registeredBy: User;
    status: ExpenseStatus;
    task: Maybe<Task>;
};

export type ExpenseCrudResult = {
    __typename?: 'ExpenseCrudResult';
    expense: Maybe<Expense>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type ExpenseInput = {
    amount: Scalars['Float'];
    cityName: Scalars['String'];
    doneBy: Scalars['String'];
    expenseDate: InputMaybe<Scalars['DateTime']>;
    expenseType: ExpenseType;
    fileKeys: InputMaybe<Array<Scalars['String']>>;
    filenames: InputMaybe<Array<Scalars['String']>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    installments: Scalars['Int'];
    mimeTypes: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    paySource: ExpensePaySource;
    paySourceBank: InputMaybe<ExpensePaySourceBank>;
    sizes: InputMaybe<Array<Scalars['Int']>>;
};

export const ExpensePaySource = {
    Credito: 'Credito',
    Debito: 'Debito',
    Otro: 'Otro',
    Reintegro: 'Reintegro',
    Transferencia: 'Transferencia',
} as const;

export type ExpensePaySource = (typeof ExpensePaySource)[keyof typeof ExpensePaySource];
export const ExpensePaySourceBank = {
    Bbva: 'BBVA',
    Chubut: 'Chubut',
    Nacion: 'Nacion',
    Otro: 'Otro',
    Santander: 'Santander',
} as const;

export type ExpensePaySourceBank =
    (typeof ExpensePaySourceBank)[keyof typeof ExpensePaySourceBank];
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
    Otro: 'Otro',
    Viatico: 'Viatico',
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];
export type ExpensesResponse = {
    __typename?: 'ExpensesResponse';
    items: Array<Expense>;
    total: Scalars['Int'];
};

export type File = {
    __typename?: 'File';
    createdAt: Scalars['Date'];
    expenses: Array<Expense>;
    filename: Scalars['String'];
    id: Scalars['ID'];
    key: Scalars['String'];
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    updatedAt: Scalars['Date'];
    url: Scalars['String'];
    urlExpire: Maybe<Scalars['Date']>;
};

export type FileCrudRef = {
    __typename?: 'FileCrudRef';
    file: Maybe<File>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type FileInput = {
    filename: Scalars['String'];
    key: Scalars['String'];
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    url: Scalars['String'];
};

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
    changePassword: AuthResult;
    createBranch: BranchCrudResult;
    createBusiness: BusinessResult;
    createCity: CityCrudRef;
    createClient: ClientResult;
    createExpense: ExpenseCrudResult;
    createFile: FileCrudRef;
    createMyTask: TaskCrudResult;
    createPreventive: PreventiveCrudRef;
    createProvince: ProvinceCrudResult;
    createTask: TaskCrudResult;
    createUser: UserCrudPothosRef;
    deleteBranch: BranchCrudResult;
    deleteBusiness: BusinessResult;
    deleteCity: CityCrudRef;
    deleteClient: ClientResult;
    deleteExpense: ExpenseCrudResult;
    deleteFile: FileCrudRef;
    deleteImage: TaskCrudResult;
    deletePreventive: PreventiveCrudRef;
    deleteProvince: ProvinceCrudResult;
    deleteTask: TaskCrudResult;
    deleteUser: UserCrudPothosRef;
    finishTask: TaskCrudResult;
    generateApprovedExpensesReport: Scalars['String'];
    generateApprovedTasksReport: Scalars['String'];
    generateUploadUrls: PresignedUrlResponse;
    login: LoginUserResult;
    logout: AuthResult;
    registerExpoToken: Scalars['Boolean'];
    sendNewUserRandomPassword: UserCrudPothosRef;
    updateBranch: BranchCrudResult;
    updateBusiness: BusinessResult;
    updateCity: CityCrudRef;
    updateClient: ClientResult;
    updateExpenseDiscountAmount: ExpenseCrudResult;
    updateExpenseStatus: ExpenseCrudResult;
    updateMyAssignedTask: TaskCrudResult;
    updatePreventive: PreventiveCrudRef;
    updateProvince: ProvinceCrudResult;
    updateTask: TaskCrudResult;
    updateTaskStatus: TaskCrudResult;
    updateUser: UserCrudPothosRef;
};

export type MutationChangePasswordArgs = {
    data: ChangePasswordInput;
};

export type MutationCreateBranchArgs = {
    input: BranchInput;
};

export type MutationCreateBusinessArgs = {
    data: BusinessInput;
};

export type MutationCreateCityArgs = {
    input: CityInput;
};

export type MutationCreateClientArgs = {
    data: ClientInput;
};

export type MutationCreateExpenseArgs = {
    expenseData: ExpenseInput;
    taskId: InputMaybe<Scalars['String']>;
};

export type MutationCreateFileArgs = {
    input: FileInput;
};

export type MutationCreateMyTaskArgs = {
    input: MyTaskInput;
};

export type MutationCreatePreventiveArgs = {
    input: PreventiveInput;
};

export type MutationCreateProvinceArgs = {
    data: ProvinceInput;
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

export type MutationDeleteBusinessArgs = {
    id: Scalars['String'];
};

export type MutationDeleteCityArgs = {
    id: Scalars['String'];
};

export type MutationDeleteClientArgs = {
    id: Scalars['String'];
};

export type MutationDeleteExpenseArgs = {
    id: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeleteFileArgs = {
    id: Scalars['String'];
};

export type MutationDeleteImageArgs = {
    imageId: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeletePreventiveArgs = {
    id: Scalars['String'];
};

export type MutationDeleteProvinceArgs = {
    id: Scalars['String'];
};

export type MutationDeleteTaskArgs = {
    id: Scalars['String'];
};

export type MutationDeleteUserArgs = {
    id: Scalars['String'];
};

export type MutationFinishTaskArgs = {
    id: Scalars['String'];
};

export type MutationGenerateApprovedExpensesReportArgs = {
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type MutationGenerateApprovedTasksReportArgs = {
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type MutationGenerateUploadUrlsArgs = {
    fileCount: Scalars['Int'];
    mimeTypes: Array<Scalars['String']>;
    prefix: Scalars['String'];
};

export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};

export type MutationRegisterExpoTokenArgs = {
    token: Scalars['String'];
};

export type MutationSendNewUserRandomPasswordArgs = {
    id: Scalars['String'];
};

export type MutationUpdateBranchArgs = {
    id: Scalars['String'];
    input: BranchInput;
};

export type MutationUpdateBusinessArgs = {
    data: BusinessInput;
    id: Scalars['String'];
};

export type MutationUpdateCityArgs = {
    id: Scalars['String'];
    input: CityInput;
};

export type MutationUpdateClientArgs = {
    data: ClientInput;
    id: Scalars['String'];
};

export type MutationUpdateExpenseDiscountAmountArgs = {
    discountAmount: InputMaybe<Scalars['Float']>;
    expenseId: Scalars['String'];
};

export type MutationUpdateExpenseStatusArgs = {
    expenseId: Scalars['String'];
    status: ExpenseStatus;
};

export type MutationUpdateMyAssignedTaskArgs = {
    input: UpdateMyTaskInput;
};

export type MutationUpdatePreventiveArgs = {
    id: Scalars['String'];
    input: PreventiveInput;
};

export type MutationUpdateProvinceArgs = {
    data: ProvinceInput;
    id: Scalars['String'];
};

export type MutationUpdateTaskArgs = {
    id: Scalars['String'];
    input: TaskInput;
};

export type MutationUpdateTaskStatusArgs = {
    id: Scalars['String'];
    status: TaskStatus;
};

export type MutationUpdateUserArgs = {
    id: Scalars['String'];
    input: UserInput;
};

export type MyTaskInput = {
    actNumber: InputMaybe<Scalars['String']>;
    assigned: InputMaybe<Array<Scalars['String']>>;
    branch: InputMaybe<Scalars['String']>;
    business: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    closedAt: InputMaybe<Scalars['DateTime']>;
    expenses: InputMaybe<Array<ExpenseInput>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    participants: InputMaybe<Array<Scalars['String']>>;
    startedAt: InputMaybe<Scalars['DateTime']>;
    taskType: TaskType;
    useMaterials: Scalars['Boolean'];
};

export type PresignedUrlResponse = {
    __typename?: 'PresignedUrlResponse';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    uploadUrls: Array<UploadUrlInfo>;
};

export type Preventive = {
    __typename?: 'Preventive';
    assigned: Array<User>;
    batteryChangedAt: Maybe<Scalars['DateTime']>;
    branch: Branch;
    business: Business;
    frequency: Maybe<PreventiveFrequency>;
    id: Scalars['ID'];
    lastDoneAt: Maybe<Scalars['DateTime']>;
    months: Array<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    status: PreventiveStatus;
    tasks: Array<Task>;
};

export type PreventiveCrudRef = {
    __typename?: 'PreventiveCrudRef';
    message: Maybe<Scalars['String']>;
    preventive: Maybe<Preventive>;
    success: Scalars['Boolean'];
};

export const PreventiveFrequency = {
    Anual: 'Anual',
    Bimestral: 'Bimestral',
    Cuatrimestral: 'Cuatrimestral',
    Mensual: 'Mensual',
    Semestral: 'Semestral',
    Trimestral: 'Trimestral',
} as const;

export type PreventiveFrequency =
    (typeof PreventiveFrequency)[keyof typeof PreventiveFrequency];
export type PreventiveInput = {
    assignedIds: Array<Scalars['String']>;
    batteryChangedAt: InputMaybe<Scalars['DateTime']>;
    branchId: Scalars['String'];
    businessId: Scalars['String'];
    frequency: InputMaybe<PreventiveFrequency>;
    lastDoneAt: InputMaybe<Scalars['DateTime']>;
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
    cities: Array<City>;
    createdAt: Scalars['Date'];
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type ProvinceCrudResult = {
    __typename?: 'ProvinceCrudResult';
    message: Maybe<Scalars['String']>;
    province: Maybe<Province>;
    success: Scalars['Boolean'];
};

export type ProvinceInput = {
    name: Scalars['String'];
};

export type Query = {
    __typename?: 'Query';
    branch: Branch;
    branchBusinesses: Array<Business>;
    branches: Array<Branch>;
    business: Business;
    businesses: Array<Business>;
    businessesCount: Scalars['Int'];
    cities: Array<City>;
    citiesCount: Scalars['Int'];
    city: City;
    client: Client;
    clientBranches: Array<Branch>;
    clientBranchesCount: Scalars['Int'];
    clients: Array<Client>;
    clientsCount: Scalars['Int'];
    expenseById: Maybe<Expense>;
    expenses: Array<Expense>;
    expensesCount: Scalars['Int'];
    file: File;
    files: Array<File>;
    images: Array<Image>;
    myAssignedTaskById: Maybe<Task>;
    myAssignedTasks: Array<Task>;
    myExpenseById: Maybe<Expense>;
    myExpenses: Maybe<Array<Expense>>;
    preventive: Preventive;
    preventives: Array<Preventive>;
    preventivesCount: Scalars['Int'];
    province: Province;
    provinces: Array<Province>;
    provincesCount: Scalars['Int'];
    taskById: Maybe<Task>;
    taskTypes: Array<TaskType>;
    tasks: Array<Task>;
    tasksCount: Scalars['Int'];
    technicians: Array<User>;
    user: User;
    users: Array<User>;
    usersCount: Scalars['Int'];
};

export type QueryBranchArgs = {
    id: Scalars['String'];
};

export type QueryBranchBusinessesArgs = {
    branch: InputMaybe<Scalars['String']>;
};

export type QueryBusinessArgs = {
    id: Scalars['String'];
};

export type QueryBusinessesArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryBusinessesCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QueryCitiesArgs = {
    provinceId: InputMaybe<Scalars['String']>;
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryCitiesCountArgs = {
    provinceId: InputMaybe<Scalars['String']>;
    search: InputMaybe<Scalars['String']>;
};

export type QueryCityArgs = {
    id: Scalars['String'];
};

export type QueryClientArgs = {
    id: Scalars['String'];
};

export type QueryClientBranchesArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    cityId: InputMaybe<Array<Scalars['String']>>;
    clientId: Scalars['String'];
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryClientBranchesCountArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    cityId: InputMaybe<Array<Scalars['String']>>;
    clientId: Scalars['String'];
    provinceId: InputMaybe<Array<Scalars['String']>>;
};

export type QueryClientsArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryClientsCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QueryExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryExpensesArgs = {
    expenseDateFrom: InputMaybe<Scalars['DateTime']>;
    expenseDateTo: InputMaybe<Scalars['DateTime']>;
    expenseType: InputMaybe<Array<ExpenseType>>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    paySource: InputMaybe<Array<ExpensePaySource>>;
    registeredBy: InputMaybe<Array<Scalars['String']>>;
    skip: InputMaybe<Scalars['Int']>;
    status: InputMaybe<Array<ExpenseStatus>>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryExpensesCountArgs = {
    expenseDateFrom: InputMaybe<Scalars['DateTime']>;
    expenseDateTo: InputMaybe<Scalars['DateTime']>;
    expenseType: InputMaybe<Array<ExpenseType>>;
    paySource: InputMaybe<Array<ExpensePaySource>>;
    registeredBy: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<ExpenseStatus>>;
};

export type QueryFileArgs = {
    id: Scalars['String'];
};

export type QueryMyAssignedTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryMyExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryPreventiveArgs = {
    id: Scalars['String'];
};

export type QueryPreventivesArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    frequency: InputMaybe<Array<PreventiveFrequency>>;
    months: InputMaybe<Array<Scalars['String']>>;
    skip?: InputMaybe<Scalars['Int']>;
    status: InputMaybe<Array<PreventiveStatus>>;
    take?: InputMaybe<Scalars['Int']>;
};

export type QueryPreventivesCountArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    frequency: InputMaybe<Array<PreventiveFrequency>>;
    months: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<PreventiveStatus>>;
};

export type QueryProvinceArgs = {
    id: Scalars['String'];
};

export type QueryProvincesArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryProvincesCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QueryTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryTasksArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    endDate: InputMaybe<Scalars['DateTime']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    status: InputMaybe<Array<TaskStatus>>;
    take: InputMaybe<Scalars['Int']>;
    taskType: InputMaybe<Array<TaskType>>;
};

export type QueryTasksCountArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    endDate: InputMaybe<Scalars['DateTime']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    status: InputMaybe<Array<TaskStatus>>;
    taskType: InputMaybe<Array<TaskType>>;
};

export type QueryUserArgs = {
    id: Scalars['String'];
};

export type QueryUsersArgs = {
    cityId: InputMaybe<Array<Scalars['String']>>;
    roles: InputMaybe<Array<Role>>;
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryUsersCountArgs = {
    cityId: InputMaybe<Array<Scalars['String']>>;
    roles: InputMaybe<Array<Role>>;
    search: InputMaybe<Scalars['String']>;
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
    actNumber: Maybe<Scalars['Int']>;
    assigned: Array<User>;
    auditor: Maybe<User>;
    branch: Maybe<Branch>;
    business: Maybe<Business>;
    businessName: Maybe<Scalars['String']>;
    clientName: Maybe<Scalars['String']>;
    closedAt: Maybe<Scalars['DateTime']>;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    description: Scalars['String'];
    expenses: Array<Expense>;
    id: Scalars['ID'];
    images: Array<Image>;
    imagesIDs: Array<Scalars['String']>;
    movitecTicket: Maybe<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    openedAt: Scalars['DateTime'];
    participants: Array<Scalars['String']>;
    preventive: Maybe<Preventive>;
    startedAt: Maybe<Scalars['DateTime']>;
    status: TaskStatus;
    taskNumber: Scalars['Int'];
    taskType: TaskType;
    updatedAt: Scalars['DateTime'];
    useMaterials: Maybe<Scalars['Boolean']>;
};

export type TaskCrudResult = {
    __typename?: 'TaskCrudResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    task: Maybe<Task>;
};

export type TaskInput = {
    actNumber: InputMaybe<Scalars['Int']>;
    assigned: Array<Scalars['String']>;
    auditor: InputMaybe<Scalars['String']>;
    branch: InputMaybe<Scalars['String']>;
    business: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    description: Scalars['String'];
    movitecTicket: InputMaybe<Scalars['String']>;
    taskType: TaskType;
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
    InspeccionPolicial: 'InspeccionPolicial',
    Instalacion: 'Instalacion',
    Preventivo: 'Preventivo',
} as const;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];
export type UpdateMyTaskInput = {
    actNumber: InputMaybe<Scalars['String']>;
    closedAt: InputMaybe<Scalars['DateTime']>;
    expenseIdsToDelete: InputMaybe<Array<Scalars['String']>>;
    expenses: InputMaybe<Array<ExpenseInput>>;
    id: Scalars['String'];
    imageIdsToDelete: InputMaybe<Array<Scalars['String']>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    participants: InputMaybe<Array<Scalars['String']>>;
    startedAt: InputMaybe<Scalars['DateTime']>;
    useMaterials: Scalars['Boolean'];
};

export type UploadUrlInfo = {
    __typename?: 'UploadUrlInfo';
    key: Scalars['String'];
    url: Scalars['String'];
    urlExpire: Scalars['String'];
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

export type RegisterExpoTokenMutationVariables = Exact<{
    token: Scalars['String'];
}>;

export type RegisterExpoTokenMutation = {
    __typename?: 'Mutation';
    registerExpoToken: boolean;
};

export type ClientsQueryVariables = Exact<{ [key: string]: never }>;

export type ClientsQuery = {
    __typename?: 'Query';
    clients: Array<{
        __typename?: 'Client';
        id: string;
        name: string;
        branches: Array<{
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            city: { __typename?: 'City'; name: string };
            businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
        }>;
    }>;
};

export type MyExpenseByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type MyExpenseByIdQuery = {
    __typename?: 'Query';
    myExpenseById: {
        __typename?: 'Expense';
        id: string;
        amount: number;
        expenseType: ExpenseType;
        cityName: string | null;
        expenseNumber: string;
        paySource: ExpensePaySource;
        paySourceBank: ExpensePaySourceBank | null;
        status: ExpenseStatus;
        doneBy: string;
        observations: string | null;
        installments: number | null;
        expenseDate: any | null;
        createdAt: any;
        task: { __typename?: 'Task'; status: TaskStatus } | null;
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        files: Array<{
            __typename?: 'File';
            id: string;
            key: string;
            url: string;
            filename: string;
            mimeType: string;
            size: number;
        }>;
        auditor: { __typename?: 'User'; id: string; fullName: string } | null;
    } | null;
};

export type CreateExpenseMutationVariables = Exact<{
    taskId: InputMaybe<Scalars['String']>;
    expenseData: ExpenseInput;
}>;

export type CreateExpenseMutation = {
    __typename?: 'Mutation';
    createExpense: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            amount: number;
            createdAt: any;
            expenseType: ExpenseType;
            expenseNumber: string;
            id: string;
            cityName: string | null;
            doneBy: string;
            observations: string | null;
            paySource: ExpensePaySource;
            paySourceBank: ExpensePaySourceBank | null;
            installments: number | null;
            expenseDate: any | null;
            status: ExpenseStatus;
            images: Array<{ __typename?: 'Image'; id: string; url: string; key: string }>;
            files: Array<{
                __typename?: 'File';
                id: string;
                url: string;
                key: string;
                filename: string;
                mimeType: string;
                size: number;
            }>;
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

export type MyExpensesQueryVariables = Exact<{ [key: string]: never }>;

export type MyExpensesQuery = {
    __typename?: 'Query';
    myExpenses: Array<{
        __typename?: 'Expense';
        amount: number;
        createdAt: any;
        expenseType: ExpenseType;
        cityName: string | null;
        expenseNumber: string;
        id: string;
        paySource: ExpensePaySource;
        status: ExpenseStatus;
        images: Array<{ __typename?: 'Image'; id: string; url: string; key: string }>;
    }> | null;
};

export type MyAssignedTasksQueryVariables = Exact<{ [key: string]: never }>;

export type MyAssignedTasksQuery = {
    __typename?: 'Query';
    myAssignedTasks: Array<{
        __typename?: 'Task';
        id: string;
        taskNumber: number;
        description: string;
        createdAt: any;
        businessName: string | null;
        clientName: string | null;
        taskType: TaskType;
        status: TaskStatus;
        business: { __typename?: 'Business'; id: string; name: string } | null;
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string };
        } | null;
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
        taskNumber: number;
        createdAt: any;
        closedAt: any | null;
        startedAt: any | null;
        participants: Array<string>;
        description: string;
        observations: string | null;
        businessName: string | null;
        clientName: string | null;
        useMaterials: boolean | null;
        actNumber: number | null;
        taskType: TaskType;
        status: TaskStatus;
        business: { __typename?: 'Business'; id: string; name: string } | null;
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        auditor: { __typename?: 'User'; fullName: string } | null;
        branch: {
            __typename?: 'Branch';
            number: number | null;
            name: string | null;
            city: {
                __typename?: 'City';
                name: string;
                province: { __typename?: 'Province'; name: string };
            };
            client: { __typename?: 'Client'; name: string };
        } | null;
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        expenses: Array<{
            __typename?: 'Expense';
            id: string;
            amount: number;
            paySource: ExpensePaySource;
            paySourceBank: ExpensePaySourceBank | null;
            expenseType: ExpenseType;
            createdAt: any;
            status: ExpenseStatus;
            doneBy: string;
            observations: string | null;
            installments: number | null;
            expenseDate: any | null;
            images: Array<{
                __typename?: 'Image';
                id: string;
                url: string;
                urlExpire: any | null;
                key: string;
            }>;
            files: Array<{
                __typename?: 'File';
                id: string;
                url: string;
                urlExpire: any | null;
                key: string;
            }>;
            registeredBy: {
                __typename?: 'User';
                id: string;
                email: string;
                fullName: string;
            };
        }>;
    } | null;
};

export type BranchBusinessesQueryVariables = Exact<{
    branch: Scalars['String'];
}>;

export type BranchBusinessesQuery = {
    __typename?: 'Query';
    branchBusinesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
};

export type CreateMyTaskMutationVariables = Exact<{
    input: MyTaskInput;
}>;

export type CreateMyTaskMutation = {
    __typename?: 'Mutation';
    createMyTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: {
            __typename?: 'Task';
            id: string;
            taskNumber: number;
            status: TaskStatus;
            actNumber: number | null;
            observations: string | null;
            createdAt: any;
            startedAt: any | null;
            closedAt: any | null;
            description: string;
            businessName: string | null;
            clientName: string | null;
            useMaterials: boolean | null;
            taskType: TaskType;
            business: { __typename?: 'Business'; id: string; name: string } | null;
            branch: {
                __typename?: 'Branch';
                id: string;
                number: number | null;
                name: string | null;
                city: {
                    __typename?: 'City';
                    id: string;
                    name: string;
                    province: { __typename?: 'Province'; id: string; name: string };
                };
                client: { __typename?: 'Client'; id: string; name: string };
            } | null;
            assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
            expenses: Array<{
                __typename?: 'Expense';
                id: string;
                amount: number;
                paySource: ExpensePaySource;
                paySourceBank: ExpensePaySourceBank | null;
                expenseType: ExpenseType;
                createdAt: any;
                installments: number | null;
                expenseDate: any | null;
                status: ExpenseStatus;
                doneBy: string;
                observations: string | null;
                images: Array<{
                    __typename?: 'Image';
                    id: string;
                    url: string;
                    urlExpire: any | null;
                    key: string;
                }>;
                files: Array<{
                    __typename?: 'File';
                    id: string;
                    url: string;
                    urlExpire: any | null;
                    key: string;
                }>;
                registeredBy: {
                    __typename?: 'User';
                    id: string;
                    email: string;
                    fullName: string;
                };
            }>;
            images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        } | null;
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
            actNumber: number | null;
            observations: string | null;
            closedAt: any | null;
            startedAt: any | null;
            businessName: string | null;
            clientName: string | null;
            useMaterials: boolean | null;
            expenses: Array<{
                __typename?: 'Expense';
                id: string;
                amount: number;
                paySource: ExpensePaySource;
                paySourceBank: ExpensePaySourceBank | null;
                expenseType: ExpenseType;
                createdAt: any;
                installments: number | null;
                expenseDate: any | null;
                status: ExpenseStatus;
                doneBy: string;
                observations: string | null;
                images: Array<{
                    __typename?: 'Image';
                    id: string;
                    url: string;
                    urlExpire: any | null;
                    key: string;
                }>;
                files: Array<{
                    __typename?: 'File';
                    id: string;
                    url: string;
                    urlExpire: any | null;
                    key: string;
                }>;
                registeredBy: {
                    __typename?: 'User';
                    id: string;
                    email: string;
                    fullName: string;
                };
            }>;
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
            actNumber: number | null;
            images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        } | null;
    };
};

export type FinishTaskMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type FinishTaskMutation = {
    __typename?: 'Mutation';
    finishTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: {
            __typename?: 'Task';
            id: string;
            taskNumber: number;
            status: TaskStatus;
            description: string;
            observations: string | null;
            closedAt: any | null;
            startedAt: any | null;
            participants: Array<string>;
            assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        } | null;
    };
};

export type TechniciansQueryVariables = Exact<{ [key: string]: never }>;

export type TechniciansQuery = {
    __typename?: 'Query';
    technicians: Array<{
        __typename?: 'User';
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
    }>;
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
export const RegisterExpoTokenDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'RegisterExpoToken' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'token' },
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
                        name: { kind: 'Name', value: 'registerExpoToken' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'token' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'token' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    RegisterExpoTokenMutation,
    RegisterExpoTokenMutationVariables
>;
export const ClientsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clients' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clients' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branches' },
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
                                                name: { kind: 'Name', value: 'name' },
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
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'businesses',
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ClientsQuery, ClientsQueryVariables>;
export const MyExpenseByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'myExpenseById' },
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
                        name: { kind: 'Name', value: 'myExpenseById' },
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
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'cityName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySourceBank' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'cityName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'doneBy' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'observations' },
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
                                    name: { kind: 'Name', value: 'files' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'key' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'filename' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mimeType' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'size' },
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
                                    name: { kind: 'Name', value: 'installments' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseDate' },
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
} as unknown as DocumentNode<MyExpenseByIdQuery, MyExpenseByIdQueryVariables>;
export const CreateExpenseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createExpense' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
                        name: { kind: 'Name', value: 'createExpense' },
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
                                                name: { kind: 'Name', value: 'amount' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseType',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cityName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'doneBy' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
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
                                                name: { kind: 'Name', value: 'files' },
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
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'filename',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'mimeType',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'size',
                                                            },
                                                        },
                                                    ],
                                                },
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
                                                    value: 'paySourceBank',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'installments',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseDate',
                                                },
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
            },
        },
    ],
} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
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
export const MyExpensesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'MyExpenses' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'myExpenses' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'cityName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseNumber' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'key' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySource' },
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
} as unknown as DocumentNode<MyExpensesQuery, MyExpensesQueryVariables>;
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
                                    name: { kind: 'Name', value: 'taskNumber' },
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
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'businessName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
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
                                                name: { kind: 'Name', value: 'name' },
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
                                    name: { kind: 'Name', value: 'taskNumber' },
                                },
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
                                    name: { kind: 'Name', value: 'startedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'participants' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'observations' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'businessName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'useMaterials' },
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
                                    name: { kind: 'Name', value: 'actNumber' },
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
                                                name: { kind: 'Name', value: 'name' },
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
                                                    value: 'paySourceBank',
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
                                                name: { kind: 'Name', value: 'files' },
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
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'installments',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'registeredBy',
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
export const BranchBusinessesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'branchBusinesses' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'branch' },
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
                        name: { kind: 'Name', value: 'branchBusinesses' },
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
} as unknown as DocumentNode<BranchBusinessesQuery, BranchBusinessesQueryVariables>;
export const CreateMyTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createMyTask' },
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
                            name: { kind: 'Name', value: 'MyTaskInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createMyTask' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'taskNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'actNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'startedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'closedAt' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'businessName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'clientName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'useMaterials',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'branch' },
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
                                                                value: 'number',
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
                                                                value: 'city',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'client',
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
                                                name: { kind: 'Name', value: 'assigned' },
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
                                                                value: 'fullName',
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
                                                name: { kind: 'Name', value: 'closedAt' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'expenses' },
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
                                                                value: 'amount',
                                                            },
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
                                                                value: 'paySourceBank',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'installments',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'expenseDate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'images',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'files',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'status',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'doneBy',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'observations',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'registeredBy',
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
} as unknown as DocumentNode<CreateMyTaskMutation, CreateMyTaskMutationVariables>;
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
                                                    value: 'actNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'closedAt' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'startedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'businessName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'clientName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'useMaterials',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'amount',
                                                            },
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
                                                                value: 'paySourceBank',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'installments',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'expenseDate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'images',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'files',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'status',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'doneBy',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'observations',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'registeredBy',
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
                                                    value: 'actNumber',
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
export const FinishTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FinishTask' },
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
                        name: { kind: 'Name', value: 'finishTask' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'taskNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'closedAt' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'startedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'participants',
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
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FinishTaskMutation, FinishTaskMutationVariables>;
export const TechniciansDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'Technicians' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technicians' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fullName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TechniciansQuery, TechniciansQueryVariables>;
