import {
  configureStore,
  ThunkAction,
  Action,
  ActionReducerMapBuilder,
  AsyncThunk,
  isRejectedWithValue,
  MiddlewareAPI,
  Middleware,
  combineReducers
} from '@reduxjs/toolkit';
import userReducer, { logout } from '../features/user/userSlice';
import { api } from './services/api';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


import { message } from 'antd'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
  blacklist: ['api']
}

const reducers = combineReducers({
  user: userReducer,
  [api.reducerPath]: api.reducer
});

const persistedReducer = persistReducer(persistConfig, reducers)



/**
 * Log a warning and show a toast!
 */
export const authMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {

      if (action.payload.status === 401) {
        message.error('Please, log in again.')
        next(logout());
        return;
      }

      if (action.payload.status === 403) {
        message.warning('Forbidden.')
      }

    }

    return next(action)
  }


export const errorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {

      if (action.payload.status === 'FETCH_ERROR' || action.payload.status === 502) {
        message.error('Network error. Check server status.')
      }

      if (action.payload.status === 500) {
        message.error('Server error.');
      }

    }

    return next(action)
  }


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck:false}).concat(api.middleware).concat([authMiddleware, errorMiddleware])
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

