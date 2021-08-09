import { Dispatch } from '@reduxjs/toolkit';

// npm package
import { v4 as uuidv4 } from 'uuid';

// helper
import { isArray, isAxiosError } from './axiosError';
import { prepareErrorData } from './prepareErrorData';
import { errorAlertFunc } from './errorAlertFunc';
import {
  setDangerAlert,
  removeDangerAlertAsync
} from '../features/alert/dangerAlertSlice';

interface ErrorHandlingProps {
  error: unknown;
  dispatch: Dispatch;
  rejectWithValue: any;
}

export const errorHandling = ({
  error,
  dispatch,
  rejectWithValue
}: ErrorHandlingProps) => {
  if (isAxiosError(error)) {
    console.log('Axiosのエラー');
    console.log('error.isAxiosError', error.isAxiosError);
    console.log('error', error.response);
    // helper function
    const { id, errorObject, message } = prepareErrorData(
      uuidv4(),
      error.response!
    );
    // この中のerrはAxiosErrorとして認識される

    // response error is Array
    if (isArray(errorObject.data.errors)) {
      // helper function
      errorAlertFunc(
        errorObject.data.errors,
        dispatch,
        id,
        setDangerAlert,
        removeDangerAlertAsync
      );
      // response error is Object
    } else {
      dispatch(setDangerAlert({ id, message }));
      dispatch<any>(removeDangerAlertAsync({ id, timeout: 5000 }));
    }
    return rejectWithValue({
      status: 'failed',
      message: message
    });
  } else {
    return rejectWithValue({
      status: 'failed',
      message: 'Something wrong in Server'
    });
  }
};
