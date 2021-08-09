import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { deletePrivateLinkAPI, updatePrivateLinkAPI } from './privateLinkAPI';

// helper
import { successAlertFunc } from '../../helpers/successAlertFunc';
import { errorHandling } from '../../helpers/errorHandling';

type PrivateLink = {
  categories: { _id: string; name: string }[];
  type: string;
  medium: string;
  clicks: number;
  _id: string;
  title: string;
  url: string;
  slug: string;
  postedBy: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Define a type for the slice state
interface PrivateLinkState {
  privateLinks: PrivateLink[];
  message: string;
  status: 'success' | 'loading' | 'failed' | 'default';
}

// Define the initial state using that type
const initialState: PrivateLinkState = {
  privateLinks: [],
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

//@Desc   Delete Link
export const deletePrivateLinkAsync = createAsyncThunk<
  PrivateLink,
  { privateLinkId: string; token: string },
  ThunkConfig
>(
  'auth/addPrivateLinkAsync',
  async (privateLinkDate, { dispatch, rejectWithValue }) => {
    console.log('ここまできているよん');
    try {
      const response = await deletePrivateLinkAPI(privateLinkDate);
      successAlertFunc({
        dispatch,
        response
      });
      console.log('response.data', response.data);
      return response.data.link;
    } catch (error) {
      console.log('エラーですt', error);
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

//@Desc   Update Link
export const updatePrivateLinkAsync = createAsyncThunk<
  PrivateLink,
  {
    privateLinkId: string;
    token: string;
    title: string;
    url: string;
    categories: string[];
    type: string;
    medium: string;
  },
  ThunkConfig
>(
  'auth/updatePrivateLinkAsync',
  async (updateLinkDate, { dispatch, rejectWithValue }) => {
    console.log('ここまできているよん');
    try {
      const response = await updatePrivateLinkAPI(updateLinkDate);
      successAlertFunc({
        dispatch,
        response
      });
      console.log('response.data', response.data);
      return response.data.link;
    } catch (error) {
      console.log('エラーですt', error);
      return errorHandling({ error, dispatch, rejectWithValue });
    }
  }
);

export const privateLinkSlice = createSlice({
  name: 'privateLink',
  initialState,
  reducers: {
    addPrivateLink: (state, action: PayloadAction<PrivateLink[]>) => {
      return { ...state, privateLinks: action.payload, status: 'success' };
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(deletePrivateLinkAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        deletePrivateLinkAsync.fulfilled,
        (state, action: PayloadAction<PrivateLink>) => {
          console.log('action.payload', action.payload);
          console.log('state.privateLinks', state.privateLinks);
          const deletedPrivateLinks = state.privateLinks.filter(
            (privateLink) => {
              return privateLink._id !== action.payload._id;
            }
          );
          return {
            ...state,
            privateLinks: deletedPrivateLinks,
            status: 'success'
          };
        }
      )
      .addCase(
        deletePrivateLinkAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          console.log('action.payload', action.payload);
          return { ...state, status: 'failed', message };
        }
      )
      .addCase(updatePrivateLinkAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        updatePrivateLinkAsync.fulfilled,
        (state, action: PayloadAction<PrivateLink>) => {
          console.log('action.payload', action.payload);
          console.log('state.privateLinks', state.privateLinks);
          const updatePrivateLinks = state.privateLinks.filter(
            (privateLink) => {
              return privateLink._id !== action.payload._id;
            }
          );
          return {
            ...state,
            privateLinks: [...updatePrivateLinks, action.payload],
            status: 'success'
          };
        }
      )
      .addCase(
        updatePrivateLinkAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          console.log('action.payload', action.payload);
          return { ...state, status: 'failed', message };
        }
      );
  }
});

export const { addPrivateLink } = privateLinkSlice.actions;

export const privateLinkStateSlice = (state: RootState) => state.privateLink;

export default privateLinkSlice.reducer;
