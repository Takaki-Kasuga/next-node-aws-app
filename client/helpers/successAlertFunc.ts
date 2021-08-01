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

interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: {
    status: number;
    message: string;
  };
}

interface SuccessAlertFuncProps {
  dispatch: Dispatch;
  response: AxiosResponse<any>;
  setSuccessAlert: ActionCreatorWithPayload<SuccessAlertStatus, string>;
  removeSuccessAlertAsync: AsyncThunk<
    string,
    {
      id: string;
      timeout?: number | undefined;
    },
    ThunkConfig
  >;
}

export const successAlertFunc = ({
  dispatch,
  response,
  setSuccessAlert,
  removeSuccessAlertAsync
}: SuccessAlertFuncProps) => {
  const id = uuidv4();
  const message = response.data.message;
  dispatch(setSuccessAlert({ id, message }));
  dispatch<any>(removeSuccessAlertAsync({ id, timeout: 100000 }));
};
