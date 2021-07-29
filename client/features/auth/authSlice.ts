import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// slice
import { setAlert, removeAlertAsync } from '../alert/alertSlice';

// npm package
import { v4 as uuidv4 } from 'uuid';

// import API
import { registerUserAPI, loginUserAPI } from './authAPI';

// helper
import { isArray, isAxiosError } from '../../helpers/axiosError';
import { errorAlert } from '../../helpers/errorAlert';
import { prepareErrorData } from '../../helpers/prepareErrorData';

// Define a type for the slice state
interface AuthState {
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  status: 'success' | 'loading' | 'failed';
  statusCode?: number;
}

// Define the initial state using that type
const initialState: AuthState = {
  message: '',
  token: '',
  user: {
    _id: '',
    name: '',
    email: '',
    role: ''
  },
  status: 'loading'
};

interface Rejected {
  statusCode: number;
  status: number;
  message: string;
}
interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: Rejected;
}
interface RegisterReturnData {
  message: string;
  status: string;
}

//@Desc   Register User
export const registerUserAsync = createAsyncThunk<
  RegisterReturnData,
  { name: string; email: string; password: string },
  ThunkConfig
>(
  'auth/registerUserAsync',
  async (registerFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerUserAPI(registerFormData);
      const id = uuidv4();
      const message = response.data.message;
      dispatch(setAlert({ id, message, alertTypeBgColorName: 'green-300' }));
      dispatch(removeAlertAsync({ id, timeout: 100000 }));
      console.log('response.data', response.data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        // helper function
        const { id, errorObject, statusCode, message } = prepareErrorData(
          uuidv4(),
          error.response!
        );
        // この中のerrはAxiosErrorとして認識される
        console.log('Axiosのエラー');
        console.log('error.isAxiosError', error.isAxiosError);
        console.log('error', error.response);

        // response error is Array
        if (isArray(errorObject.data.errors)) {
          // helper function
          errorAlert(
            errorObject.data.errors,
            dispatch,
            id,
            setAlert,
            removeAlertAsync
          );
          // response error is Object
        } else {
          dispatch(setAlert({ id, message, alertTypeBgColorName: 'red-400' }));
          dispatch(removeAlertAsync({ id, timeout: 5000 }));
        }
        return rejectWithValue({
          statusCode,
          status: 'failed',
          message: message
        });
      } else {
        return rejectWithValue({
          statusCode: 500,
          status: 'failed',
          message: 'Something wrong in Server'
        });
      }
    }
  }
);

//@Desc   Login User
export const loginUserAsync = createAsyncThunk<
  any,
  { email: string; password: string },
  any
>(
  'auth/loginUserAsync',
  async (loginFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUserAPI(loginFormData);
      const id = uuidv4();
      const message = response.data.message;
      dispatch(setAlert({ id, message, alertTypeBgColorName: 'green-300' }));
      dispatch(removeAlertAsync({ id, timeout: 5000 }));
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        // helper function
        const { id, errorObject, statusCode, message } = prepareErrorData(
          uuidv4(),
          error.response!
        );
        // この中のerrはAxiosErrorとして認識される
        console.log('Axiosのエラー');
        console.log('error.isAxiosError', error.isAxiosError);
        console.log('error', error.response);

        // response error is Array
        if (isArray(errorObject.data.errors)) {
          // helper function
          errorAlert(
            errorObject.data.errors,
            dispatch,
            id,
            setAlert,
            removeAlertAsync
          );
          // response error is Object
        } else {
          dispatch(setAlert({ id, message, alertTypeBgColorName: 'red-400' }));
          dispatch(removeAlertAsync({ id, timeout: 5000 }));
        }
        return rejectWithValue({
          statusCode,
          status: 'failed',
          message: message
        });
      } else {
        return rejectWithValue({
          statusCode: 500,
          status: 'failed',
          message: 'Something wrong in Server'
        });
      }
    }
  }
);

export const authSlice = createSlice({
  name: 'authentication',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      return state;
    },
    decrement: (state) => {
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        registerUserAsync.fulfilled,
        (state: any, action: PayloadAction<RegisterReturnData>) => {
          const { status, message } = action.payload;
          return { ...state, status, message };
        }
      )
      .addCase(
        registerUserAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          console.log('action.payload', action.payload);
          const { statusCode, status, message } = action.payload as Rejected;
          return { ...state, statusCode, status, message };
        }
      );
  }
});

export const { increment, decrement } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export default authSlice.reducer;
