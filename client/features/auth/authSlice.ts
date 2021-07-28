import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// slice
import { setAlert, removeAlertAsync } from '../alert/alertSlice';

// npm package
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// import API
import { registerUserAPI } from './authAPI';

const isAxiosError = (error: any): error is AxiosError => {
  return !!error.isAxiosError;
};

// Define a type for the slice state
interface authState {
  value: number;
  status: 'success' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: any = {
  value: 0,
  status: 'loading'
};

export const registerUserAsync = createAsyncThunk<any, any, any>(
  'auth/registerUserAsync',
  async (registerFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerUserAPI(registerFormData);
      const id = uuidv4();
      const message = response.data.message;
      dispatch(setAlert({ id, message, alertTypeBgColorName: 'bg-green-300' }));
      dispatch(removeAlertAsync({ id, timeout: 100000 }));
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const id = uuidv4();
        const errorObject = error.response;
        const message = errorObject!.data.message;
        // この中のerrはAxiosErrorとして認識される
        console.log('Axiosのエラー');
        console.log('error.isAxiosError', error.isAxiosError);
        console.log('error', error.response);
        dispatch(setAlert({ id, message, alertTypeBgColorName: 'bg-red-400' }));
        dispatch(removeAlertAsync({ id, timeout: 100000 }));
        return rejectWithValue({
          status: errorObject!.status,
          message: errorObject!.data.message
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
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: any) => {
      state.value += action.payload;
    },
    extraReducers: (builder) => {
      builder
        .addCase(registerUserAsync.pending, (state: any) => {
          state.status = 'loading';
          return state;
        })
        .addCase(registerUserAsync.fulfilled, (state: any, action: any) => {
          state.status = 'success';
          console.log('action.payload', action.payload);
          return state;
        })
        .addCase(registerUserAsync.rejected, (state: any, action: any) => {
          state.status = 'failed';
          console.log('action.payload', action.payload);
          return state;
        });
    }
  }
});

export const { increment, decrement, incrementByAmount } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth;

export default authSlice.reducer;
