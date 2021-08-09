import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { removeSuccessAlertAPI } from './successAlertAPI';

interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectWithValue?: {
    status: number;
    message: string;
  };
}

export interface SuccessAlertStatus {
  id: string;
  message: string;
}

// Define a type for the slice state
interface SuccessAlertState {
  successAlertStatus: SuccessAlertStatus[];
  status: 'success' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: SuccessAlertState = {
  successAlertStatus: [],
  status: 'loading'
};

export const removeSuccessAlertAsync = createAsyncThunk<
  string,
  { id: string; timeout?: number },
  ThunkConfig
>(
  'alert/removeSuccessAlertAsync',
  async ({ id, timeout = 5000 }, { rejectWithValue }) => {
    try {
      const response = await removeSuccessAlertAPI(id, timeout);
      return response.id;
    } catch (error) {
      return rejectWithValue({
        status: '400',
        message: ' Server could not treat this request...'
      });
    }
  }
);

export const successAlertSlice = createSlice({
  name: 'successAlert',
  initialState,
  reducers: {
    setSuccessAlert: (state, action: PayloadAction<SuccessAlertStatus>) => {
      state.status = 'success';
      state.successAlertStatus.push(action.payload);
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeSuccessAlertAsync.pending, (state) => {
        state.status = 'loading';
        return state;
      })
      .addCase(removeSuccessAlertAsync.fulfilled, (state, action) => {
        state.status = 'success';
        const filterAlertStatus = state.successAlertStatus.filter((alert) => {
          return alert.id !== action.payload;
        });
        state.successAlertStatus = filterAlertStatus;
        return state;
      });
  }
});

export const { setSuccessAlert } = successAlertSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const successAlertState = (state: RootState) => state.successAlert;

export default successAlertSlice.reducer;
