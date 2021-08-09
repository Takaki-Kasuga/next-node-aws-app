import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch,
  current
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import {
  addCategoryAPI,
  updateCategoryAPI,
  getCategoriesAPI,
  deleteCategoriesAPI
} from './categoryAPI';

// helper
import { successAlertFunc } from '../../helpers/successAlertFunc';
import { errorHandling } from '../../helpers/errorHandling';

interface CategoryData {
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
  categories: CategoryData[];
  message: string;
  status: 'success' | 'loading' | 'failed' | 'default';
}

// Define the initial state using that type
const initialState: CategoryState = {
  categories: [],
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
  CategoryData,
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
    try {
      const response = await addCategoryAPI(addCategoryFormData);
      successAlertFunc({
        dispatch,
        response
      });
      return response.data.category;
    } catch (error) {
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

//@Desc   Register User
export const updateCategoryAsync = createAsyncThunk<
  CategoryData,
  {
    name: string;
    content: string;
    image: any;
    token: string;
    slug: string;
  },
  ThunkConfig
>(
  'auth/updateCategoryAsync',
  async (updateCategoryFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateCategoryAPI(updateCategoryFormData);
      successAlertFunc({
        dispatch,
        response
      });
      return response.data.category;
    } catch (error) {
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

//@Desc   Get Categories
export const getCategoriesAsync = createAsyncThunk<
  CategoryData[],
  undefined,
  ThunkConfig
>('auth/getCategoriesAsync', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await getCategoriesAPI();
    return response.data.categories as CategoryData[];
  } catch (error) {
    return errorHandling({ error, dispatch, rejectWithValue });
  }
});

//@Desc    Delete Categories
export const deleteCategoriesAsync = createAsyncThunk<
  CategoryData,
  { slug: string; token: string },
  ThunkConfig
>(
  'auth/deleteCategoriesAsync',
  async (deleteCategoryData, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteCategoriesAPI(deleteCategoryData);
      return response.data.category as CategoryData;
    } catch (error) {
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
        (state, action: PayloadAction<CategoryData>) => {
          return {
            ...state,
            categories: [...state.categories, action.payload],
            status: 'success'
          };
        }
      )
      .addCase(
        addCategoryAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      )
      .addCase(updateCategoryAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        updateCategoryAsync.fulfilled,
        (state, action: PayloadAction<CategoryData>) => {
          if (state.categories) {
            const updateCategory = state.categories.filter((category) => {
              return category._id !== action.payload._id;
            });
            return {
              ...state,
              categories: [...updateCategory, action.payload],
              status: 'success'
            };
          } else {
            return {
              ...state,
              categories: [{ ...action.payload }],
              status: 'success'
            };
          }
        }
      )
      .addCase(
        updateCategoryAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      )
      .addCase(getCategoriesAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        getCategoriesAsync.fulfilled,
        (state, action: PayloadAction<CategoryData[]>) => {
          return { ...state, categories: action.payload, status: 'success' };
        }
      )
      .addCase(
        getCategoriesAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      )
      .addCase(deleteCategoriesAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        deleteCategoriesAsync.fulfilled,
        (state, action: PayloadAction<CategoryData>) => {
          const deletedCategories = state.categories.filter((category) => {
            return category._id !== action.payload._id;
          });

          return {
            ...state,
            categories: deletedCategories,
            status: 'success'
          };
        }
      )
      .addCase(
        deleteCategoriesAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          return { ...state, status, message };
        }
      );
  }
});

export const { defaultStatus, decrement } = categorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const categoryStateSlice = (state: RootState) => state.category;

export default categorySlice.reducer;
