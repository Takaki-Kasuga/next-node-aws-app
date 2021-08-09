import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { createLinkAPI } from './linkAPI';

// helper
import { successAlertFunc } from '../../helpers/successAlertFunc';
import { errorHandling } from '../../helpers/errorHandling';

interface CreateLinkData {
  categories: string[];
  type: string;
  medium: string;
  clicks: number;
  _id: string;
  title: string;
  url: string;
  slug: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define a type for the slice state
interface CategoryState {
  link: CreateLinkData;
  message: string;
  status: 'success' | 'loading' | 'failed' | 'default';
}

// Define the initial state using that type
const initialState: CategoryState = {
  link: {
    categories: [],
    type: '',
    medium: '',
    clicks: 0,
    _id: '',
    title: '',
    url: '',
    slug: '',
    postedBy: '',
    createdAt: '',
    updatedAt: '',
    __v: 0
  },
  message: '',
  status: 'default'
};

interface CreateLinkFormData {
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
  token: string;
}

interface Rejected {
  status: string;
  message: string;
}
interface ThunkConfig {
  state?: RootState;
  dispatch?: Dispatch;
  rejectValue?: Rejected;
}

//@Desc   Register User
export const createLinkAsync = createAsyncThunk<
  CategoryState,
  CreateLinkFormData,
  ThunkConfig
>(
  'auth/createLinkAsync',
  async (createLinkFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await createLinkAPI(createLinkFormData);
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

export const linkSlice = createSlice({
  name: 'link',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    defaultStatus: (state) => {
      return { ...state, status: 'default' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLinkAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        createLinkAsync.fulfilled,
        (state: any, action: PayloadAction<CategoryState>) => {
          const { status, message, link } = action.payload;
          return { ...state, link, status, message };
        }
      )
      .addCase(
        createLinkAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          return { ...state, status: 'failed', message };
        }
      );
  }
});

export const { defaultStatus } = linkSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const linkStateSlice = (state: RootState) => state.link;

export default linkSlice.reducer;
