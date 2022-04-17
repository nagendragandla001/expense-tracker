import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { getCookie } from "./cookie-manager";
import { ExpensesI } from "./expenses-service";

const getHeaders = (): AxiosRequestHeaders => {
  const accessToken = getCookie("Authorization") || "";

  return {
    Authorization: accessToken,
    "Content-Type": "application/json",
  };
};

export const GET = (url: string): Promise<AxiosResponse<ExpensesI>> => {
  return axios.request({
    url: url,
    method: "GET",
    headers: getHeaders(),
  });
};

export const PUT = (url: string, payload: any): Promise<any> => {
  return axios.request({
    url: url,
    method: "PUT",
    headers: getHeaders(),
    data: payload,
  });
};

export const DELETE = (url: string, payload: any): Promise<any> => {
  return axios.request({
    url: url,
    method: "DELETE",
    headers: getHeaders(),
    data: payload,
  });
};
