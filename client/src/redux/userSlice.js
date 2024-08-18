import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userInfo',

  initialState: {
    userInfo: {},
    loading: false,
    error: null,
    countdown: 0,
  },
  reducers: {
    fetchSuccess: (state, action) => {
      state.userInfo = action.payload;
    },

    clearUserInfo: (state) => {
      state.userInfo = {};
    },
    updateCountDown: (state, action) => {
      state.countdown = action.payload;
    },
    clearCount: (state) => {
      state.countdown = 0;
    },
  },
});

export const {
  fetchFail,
  fetchStart,
  fetchSuccess,
  clearUserInfo,
  updateCountDown,
  clearCount
} = userSlice.actions;

export default userSlice.reducer;
