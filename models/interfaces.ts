//Interfaces for every model

import * as types from './types'

//User fields
export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  city?:ICity;
  fullName?: string;
  roles?:types.Role[]
  password?:string;
}
export interface IImage{
  _id:string,
  name:string,
  url:string
}

export interface IClient {
  _id:string,
  name:string
}


export interface IBusiness{
  _id:string,
  name:string
}

export interface IProvince{
  _id:string,
  name:string
}

export interface ICity{
  _id:string,
  name:string,
  province:IProvince
}

export interface IBranch{
  _id?:string,
  id?:string, //local id, used when the objects are created on the app, and then sent to the server
  isSynched:boolean,
  number:number,
  city:ICity,
  client:IClient,
  businesses:IBusiness[],
}

export interface IPreventive {
  _id:string,
  assigned:IUser[],
  business:IBusiness,
  branch:IBranch,
  status:types.PreventiveStatus,
  frequency?:types.Frequency,
  months?:types.Month[],
  lastDoneAt?:Date,
  batteryChangedAt?:Date
  observations?:string
}

export interface ITask {
  _id?:string,
  id?:string, //local id, used when the objects are created on the app, and then sent to the server
  isSynched:boolean,
  branch:IBranch,
  business:IBusiness,
  assigned?:IUser,
  openedAt:Date,
  taskType:types.TaskType,
  status:types.TaskStatus,
  description:string,
  participants?:IUser[],
  auditor?:IUser,
  activity?:IActivity,
  operatorName?:string,
  image?:IImage,
  workOrderNumber?:number,
  closedAt?:Date,
}

export interface IExpense {
  _id?:string,
  id?:string, //local id, used when the objects are created on the app, and then sent to the server
  isSynched:boolean,
  doneBy:IUser,
  expenseType:types.ExpenseType,
  paySource:types.PaySource,
  status:types.ExpenseStatus,
  image:IImage,
  amount:Number,
  task?:ITask,
  auditor?:IUser,
  activity?:IActivity
}

export interface IActivity{
  _id?:string,
  id?:string, //local id, used when the objects are created on the app, and then sent to the server
  isSynched:boolean,
  name:string,
  description:string,
  startDate:Date,
  openedBy:IUser,
  participants?:IUser[],
  finishDate?:Date,
}

export interface IUserActivities{
  userActivities?:IActivity[];
  participantActivities?:IActivity[]
}
