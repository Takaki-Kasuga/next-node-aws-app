import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { removeAlertAPI } from './alertAPI';

interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: {
    status: number;
    message: string;
  };
}

export interface AlertStatus {
  alertTypeBgColorName: string;
  id: string;
  message: string;
}

// Define a type for the slice state
interface AlertState {
  alertStatus: AlertStatus[];
  status: 'success' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: AlertState = {
  alertStatus: [],
  status: 'loading'
};

export const removeAlertAsync = createAsyncThunk<
  string,
  { id: string; timeout?: number },
  ThunkConfig
>(
  'alert/removeAlertAsync',
  async ({ id, timeout = 5000 }, { rejectWithValue }) => {
    try {
      const response = await removeAlertAPI(id, timeout);
      return response.id;
    } catch (error) {
      return rejectWithValue({
        status: '400',
        message: ' Server could not treat this request...'
      });
    }
  }
);

export const alertSlice = createSlice({
  name: 'alert',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<AlertStatus>) => {
      console.log('発火しています。');
      state.status = 'success';
      state.alertStatus.push(action.payload);
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeAlertAsync.pending, (state) => {
        state.status = 'loading';
        return state;
      })
      .addCase(removeAlertAsync.fulfilled, (state, action) => {
        state.status = 'success';
        const filterAlertStatus = state.alertStatus.filter((alert) => {
          return alert.id !== action.payload;
        });
        state.alertStatus = filterAlertStatus;
        return state;
      });
  }
});

export const { setAlert } = alertSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const alertState = (state: RootState) => state.alert;

export default alertSlice.reducer;
