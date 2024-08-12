import { createSlice } from '@reduxjs/toolkit';

export const shippingSlice = createSlice({
  name: 'shipping',

  initialState: {
    shipping: {},
  },
  reducers: {
    shippingSuccess: (state, action) => {
      state.shipping = action.payload;
    },
    clearShipping: (state) => {
      state.shipping = {};
    },
  },
});

export const {shippingSuccess, clearShipping} = shippingSlice.actions
export default shippingSlice.reducer
