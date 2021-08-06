import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/category/categorySlice';
import dangerAlertReducer from '../features/alert/dangerAlertSlice';
import successAlertReducer from '../features/alert/successAlertSlice';
import linkReducer from '../features/link/linkSlice';
import privateLinkReducer from '../features/link/privateLinkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    dangerAlert: dangerAlertReducer,
    successAlert: successAlertReducer,
    privateLink: privateLinkReducer,
    link: linkReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
