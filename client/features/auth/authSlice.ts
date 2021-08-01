import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Router from 'next/router';

// import API
import {
  registerUserAPI,
  loginUserAPI,
  forgotPasswordAPI,
  resetPasswordAPI
} from './authAPI';

// helper
import { authenticate, isAuth } from '../../helpers/storageToken';
import { errorHandling } from '../../helpers/errorHandling';
import { successAlertFunc } from '../../helpers/successAlertFunc';

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
  status: number;
  message: string;
}
interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectValue?: Rejected;
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
      successAlertFunc({
        dispatch,
        response
      });
      console.log('response.data', response.data);
      return response.data;
    } catch (error) {
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

export interface LoginReturnData {
  message: string;
  status: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

//@Desc   Login User
export const loginUserAsync = createAsyncThunk<
  LoginReturnData,
  { email: string; password: string },
  ThunkConfig
>(
  'auth/loginUserAsync',
  async (loginFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUserAPI(loginFormData);
      successAlertFunc({
        dispatch,
        response
      });
      authenticate(response.data, () => {
        return isAuth() && isAuth().role === 'admin'
          ? Router.push('/admin')
          : Router.push('/user');
      });
      return response.data;
    } catch (error) {
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

//@Desc   Forgot password
export const forgotPasswordAsync = createAsyncThunk<
  any,
  { email: string },
  ThunkConfig
>('auth/forgotPasswordAsync', async (email, { dispatch, rejectWithValue }) => {
  try {
    const response = await forgotPasswordAPI(email);
    successAlertFunc({
      dispatch,
      response
    });
    return response.data;
  } catch (error) {
    return errorHandling({ error, dispatch, rejectWithValue });
  }
});

//@Desc    Reset password
export const resetPasswordAsync = createAsyncThunk<
  any,
  { newPassword: string; token: string },
  ThunkConfig
>(
  'auth/resetPasswordAsync',
  async (resetPasswordFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await resetPasswordAPI(resetPasswordFormData);
      successAlertFunc({
        dispatch,
        response
      });
      return response.data;
    } catch (error) {
      return errorHandling({ error, dispatch, rejectWithValue });
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
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      )
      .addCase(loginUserAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        loginUserAsync.fulfilled,
        (state: any, action: PayloadAction<LoginReturnData>) => {
          const { status, message, user, token } = action.payload;
          return { ...state, status, message, user, token };
        }
      )
      .addCase(
        loginUserAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          console.log('action.payload', action.payload);
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      );
  }
});

export const { increment, decrement } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const authStateSlece = (state: RootState) => state.auth;

export default authSlice.reducer;
