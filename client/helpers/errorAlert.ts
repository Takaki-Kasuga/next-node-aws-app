import {
  Dispatch,
  AsyncThunk,
  ActionCreatorWithPayload
} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import { DangerAlertStatus } from '../features/alert/dangerAlertSlice';

interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: {
    status: number;
    message: string;
  };
}

export const errorAlert = (
  errorArray: {
    location: string;
    msg: string;
    param: string;
    value: string;
  }[],
  dispatch: Dispatch,
  id: string,
  setAlert: ActionCreatorWithPayload<DangerAlertStatus, string>,
  removeAlertAsync: AsyncThunk<
    string,
    {
      id: string;
      timeout?: number | undefined;
    },
    ThunkConfig
  >
) => {
  errorArray.forEach(
    (error: {
      location: string;
      msg: string;
      param: string;
      value: string;
    }) => {
      console.log('処理が遠ています。');
      dispatch(
        setAlert({
          id,
          message: error.msg
        })
      );
      dispatch<any>(removeAlertAsync({ id, timeout: 5000 }));
    }
  );
};
