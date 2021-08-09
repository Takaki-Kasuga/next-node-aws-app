import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { removeDangerAlertAPI } from './dangerAlertAPI';

interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: {
    status: number;
    message: string;
  };
}

export interface DangerAlertStatus {
  id: string;
  message: string;
}

// Define a type for the slice state
interface DangerAlertState {
  dangerAlertStatus: DangerAlertStatus[];
  status: 'success' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: DangerAlertState = {
  dangerAlertStatus: [],
  status: 'loading'
};

export const removeDangerAlertAsync = createAsyncThunk<
  string,
  { id: string; timeout?: number },
  ThunkConfig
>(
  'alert/removeDangerAlertAsync',
  async ({ id, timeout = 5000 }, { rejectWithValue }) => {
    try {
      const response = await removeDangerAlertAPI(id, timeout);
      return response.id;
    } catch (error) {
      return rejectWithValue({
        status: '400',
        message: ' Server could not treat this request...'
      });
    }
  }
);

export const dangerAlertSlice = createSlice({
  name: 'dangerAlert',
  initialState,
  reducers: {
    setDangerAlert: (state, action: PayloadAction<DangerAlertStatus>) => {
      console.log('発火しています。');
      state.status = 'success';
      state.dangerAlertStatus.push(action.payload);
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeDangerAlertAsync.pending, (state) => {
        state.status = 'loading';
        return state;
      })
      .addCase(removeDangerAlertAsync.fulfilled, (state, action) => {
        state.status = 'success';
        const filterAlertStatus = state.dangerAlertStatus.filter((alert) => {
          return alert.id !== action.payload;
        });
        state.dangerAlertStatus = filterAlertStatus;
        return state;
      });
  }
});

export const { setDangerAlert } = dangerAlertSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const dangerAlertState = (state: RootState) => state.dangerAlert;

export default dangerAlertSlice.reducer;
