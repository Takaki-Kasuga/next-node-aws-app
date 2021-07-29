import { AxiosError } from 'axios';

export const isAxiosError = (error: any): error is AxiosError => {
  return !!error.isAxiosError;
};

export const isArray = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
