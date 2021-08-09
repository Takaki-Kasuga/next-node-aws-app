// npm package
import { v4 as uuidv4 } from 'uuid';
import {
  Dispatch,
  AsyncThunk,
  ActionCreatorWithPayload
} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { AxiosResponse } from 'axios';

import { SuccessAlertStatus } from '../features/alert/successAlertSlice';

import {
  setSuccessAlert,
  removeSuccessAlertAsync
} from '../features/alert/successAlertSlice';

interface SuccessAlertFuncProps {
  dispatch: Dispatch;
  response: AxiosResponse<any>;
}

export const successAlertFunc = ({
  dispatch,
  response
}: SuccessAlertFuncProps) => {
  const id = uuidv4();
  const message = response.data.message;
  dispatch(setSuccessAlert({ id, message }));
  dispatch<any>(removeSuccessAlertAsync({ id, timeout: 5000 }));
};
