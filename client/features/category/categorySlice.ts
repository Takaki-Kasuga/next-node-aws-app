import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Router from 'next/router';

// slice
import {
  setDangerAlert,
  removeDangerAlertAsync
} from '../alert/dangerAlertSlice';
import {
  setSuccessAlert,
  removeSuccessAlertAsync
} from '../alert/successAlertSlice';

// npm package
import { v4 as uuidv4 } from 'uuid';

// import API
import { addCategoryAPI } from './categoryAPI';

// helper
import { isArray, isAxiosError } from '../../helpers/axiosError';
import { errorAlert } from '../../helpers/errorAlert';
import { prepareErrorData } from '../../helpers/prepareErrorData';
import { authenticate, isAuth } from '../../helpers/storageToken';
import { successAlertFunc } from '../../helpers/successAlertFunc';

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
  rejectWithValue?: Rejected;
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
        response,
        setSuccessAlert,
        removeSuccessAlertAsync
      });
      // const id = uuidv4();
      // const message = response.data.message;
      // dispatch(setSuccessAlert({ id, message }));
      // dispatch(removeSuccessAlertAsync({ id, timeout: 100000 }));
      console.log('response.data', response.data);
      return response.data;
    } catch (error) {
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
          errorAlert(
            errorObject.data.errors,
            dispatch,
            id,
            setDangerAlert,
            removeDangerAlertAsync
          );
          // response error is Object
        } else {
          dispatch(setDangerAlert({ id, message }));
          dispatch(removeDangerAlertAsync({ id, timeout: 5000 }));
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
          return { ...state, status };
        }
      );
  }
});

export const { defaultStatus, decrement } = categorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const categoryStateSlice = (state: RootState) => state.category;

export default categorySlice.reducer;
