import { AxiosResponse } from "axios";
import config from "../config";
import { DELETE, GET, PUT } from "./api-methods";

export interface ExpenseI {
  date: string;
  expense: string;
  expenseId: string;
  expenseType: string;
}

export interface ExpensesI {
  Count: number;
  ScannedCount: number;
  Items: ExpenseI[];
}

export const getExpenses = async (): Promise<AxiosResponse<any>> => {
  return await GET(config.BASE_URL);
};

export const addExpense = async (payload: any): Promise<any> => {
  return await PUT(config.BASE_URL, payload);
};

export const deleteExpense = async (payload: any): Promise<any> => {
  return await DELETE(config.BASE_URL, payload);
};
