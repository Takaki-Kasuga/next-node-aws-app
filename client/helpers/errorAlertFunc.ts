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

export const errorAlertFunc = (
  errorArray: {
    location: string;
    msg: string;
    param: string;
    value: string;
  }[],
  dispatch: Dispatch,
  id: string,
  setDangerAlert: ActionCreatorWithPayload<DangerAlertStatus, string>,
  removeDangerAlertAsync: AsyncThunk<
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
      dispatch(
        setDangerAlert({
          id,
          message: error.msg
        })
      );
      dispatch<any>(removeDangerAlertAsync({ id, timeout: 5000 }));
    }
  );
};
