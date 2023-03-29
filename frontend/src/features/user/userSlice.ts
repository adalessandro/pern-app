import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState,/* genericRequestComplete , AppThunk */ } from '../../app/store';
import { _login } from './loginAPI';
import { User } from '@backend/models';
import { RequestState } from '../../utils/types';
import { showError } from '../../utils/helpers';

interface UserState extends User {
  accessToken: string
};

interface UserState extends RequestState { };

const initialState: Partial<UserState> = {
  username: '',
  accessToken: '',
  status: 'idle',
  message: '',
  role: '',
  fullname: '',
};

interface Login {
  username: string,
  password: string
}

export const login = createAsyncThunk(
  'user/login',
  async (data: Login) => {
    try {
      const response = await _login(data.username, data.password);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    } catch (error: any) {
      //console.log(error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_RESPONSE') {
        showError('Network error. Check server status.')
      }
      return error!.response!.data
    }

  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    logout: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state = Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state: any) => {
      state.status = 'loading';
    })
    .addCase(login.rejected, (state: any, action) => {
      state.status = 'failed';
      state = Object.assign(state, action.payload);
    })
    .addCase(login.fulfilled, (state: any, action) => {
      state = Object.assign(state, action.payload);
      state.status = 'idle';
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const isLogged = (state: RootState) => state.user.accessToken !== '';


export default userSlice.reducer;
