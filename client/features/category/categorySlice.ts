import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { addCategoryAPI } from './categoryAPI';

// helper
import { successAlertFunc } from '../../helpers/successAlertFunc';
import { errorHandling } from '../../helpers/errorHandling';

interface CategoryReturnData {
  image: {
    url: string;
    key: string;
  };
  _id: string;
  name: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define a type for the slice state
interface CategoryState {
  saveCategory: CategoryReturnData;
  message: string;
  status: 'success' | 'loading' | 'failed' | 'default';
}

// Define the initial state using that type
const initialState: CategoryState = {
  saveCategory: {
    image: {
      url: '',
      key: ''
    },
    _id: '',
    name: '',
    content: '',
    slug: '',
    createdAt: '',
    updatedAt: '',
    __v: 0
  },
  message: '',
  status: 'default'
};

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
export const addCategoryAsync = createAsyncThunk<
  CategoryReturnData,
  {
    name: string;
    content: string;
    image: any;
    token: string;
  },
  ThunkConfig
>(
  'auth/addCategoryAsync',
  async (addCategoryFormData, { dispatch, rejectWithValue }) => {
    console.log('ここまできているよん');
    try {
      const response = await addCategoryAPI(addCategoryFormData);
      successAlertFunc({
        dispatch,
        response
      });
      console.log('response.data', response.data);
      return response.data;
    } catch (error) {
      console.log('エラーですt', error);
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

export const categorySlice = createSlice({
  name: 'category',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    defaultStatus: (state) => {
      return { ...state, status: 'default' };
    },
    decrement: (state) => {
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategoryAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        addCategoryAsync.fulfilled,
        (state: any, action: PayloadAction<CategoryReturnData>) => {
          return { ...state, ...action.payload };
        }
      )
      .addCase(
        addCategoryAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          console.log('action.payload', action.payload);
          return { ...state, status, message };
        }
      );
  }
});

export const { defaultStatus, decrement } = categorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const categoryStateSlice = (state: RootState) => state.category;

export default categorySlice.reducer;
