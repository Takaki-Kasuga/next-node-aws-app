import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Dispatch
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// import API
import { deleteLinkAPI } from './linksAPI';

// helper
import { successAlertFunc } from '../../helpers/successAlertFunc';
import { errorHandling } from '../../helpers/errorHandling';

interface LinkData {
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
  type: string;
  medium: string;
  clicks: number;
  _id: string;
  title: string;
  url: string;
  slug: string;
  postedBy: {
    name: string;
    username: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define a type for the slice state
interface LinksState {
  links: LinkData[];
  message: string;
  status: 'success' | 'loading' | 'failed' | 'default';
}

// Define the initial state using that type
const initialState: LinksState = {
  links: [],
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

//@Desc  Delete Link
export const deleteLinkAsync = createAsyncThunk<
  LinkData,
  { linkId: string; token: string },
  ThunkConfig
>(
  'auth/deleteLinkAsync',
  async (deleteLinkData, { dispatch, rejectWithValue }) => {
    console.log('ここまできているよん');
    try {
      const response = await deleteLinkAPI(deleteLinkData);
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

export const linksSlice = createSlice({
  name: 'links',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    defaultStatus: (state) => {
      return { ...state, status: 'default' };
    },
    addLinks: (state, action: PayloadAction<LinkData[]>) => {
      state.links.forEach((linkState) => {
        const filteringArray = action.payload.forEach((payloadLink, index) => {
          if (linkState._id === payloadLink._id) {
            action.payload.splice(index, 1);
          }
        });
        return filteringArray;
      });

      return {
        ...state,
        status: 'success',
        links: [...state.links, ...action.payload]
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteLinkAsync.pending, (state) => {
        return { ...state, status: 'loading' };
      })
      .addCase(
        deleteLinkAsync.fulfilled,
        (state, action: PayloadAction<LinkData>) => {
          const deletedLinks = state.links.filter((link) => {
            console.log(
              'link._id !== action.payload._id',
              link._id !== action.payload._id
            );
            return link._id !== action.payload._id;
          });
          console.log('deletedLinks', deletedLinks);
          return { ...state, status: 'success', links: deletedLinks };
        }
      )
      .addCase(
        deleteLinkAsync.rejected,
        (state: any, action: PayloadAction<unknown>) => {
          const { status, message } = action.payload as Rejected;
          console.log('action.payload', action.payload);
          return { ...state, status: 'failed', message };
        }
      );
  }
});

export const { defaultStatus, addLinks } = linksSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const linksStateSlice = (state: RootState) => state.links;

export default linksSlice.reducer;
