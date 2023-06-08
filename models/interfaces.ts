//Interfaces for every model
import mongoose from "mongoose";
import * as types from "./types";

//User fields
export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  city?: ICity;
  fullName?: string;
  publicKey: string;
  roles?: types.Role[];
  password?: string;
}
export interface IImage {
  _id: string;
  name: string;
  url: string;
}

export interface IClient {
  _id: string;
  name: string;
}

export interface IBusiness {
  _id: string;
  name: string;
}

export interface IProvince {
  _id: string;
  name: string;
}

export interface ICity {
  _id: string;
  name: string;
  province: IProvince;
}

export interface IBranch {
  _id: string;
  number: number;
  city: ICity | types.ID;
  client: IClient | types.ID;
  businesses: IBusiness[];
}

export interface ITask {
  _id?: types.ID;
  branch: IBranch | types.ID;
  business: IBusiness;
  openedAt: Date;
  taskType: types.TaskType;
  status: types.TaskStatus;
  description: string;
  participants?: IUser[];
  auditor?: IUser;
  activity?: IActivity | types.ID;
  operatorName?: string;
  image?: IImage;
  workOrderNumber?: number;
  closedAt?: Date;
}

export interface IExpense {
  _id?: types.ID;
  expenseType: types.ExpenseType;
  paySource: types.PaySource;
  status: types.ExpenseStatus;
  image: IImage;
  amount: number;
  task?: ITask | types.ID;
  activity?: IActivity | types.ID;
}

export interface IActivity {
  _id?: types.ID;
  name: string;
  description: string;
  startDate: Date;
  openedBy: types.ID;
  participants?: types.ID[];
  finishDate?: Date;
}

export interface IUserActivities {
  userActivities?: IActivity[];
  participantActivities?: IActivity[];
}
