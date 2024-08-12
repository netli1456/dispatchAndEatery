import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    cartItems: [],
  },
  reducers: {
    addCart: (state, action) => {
      const newItem = action.payload;
      const quantity = action.payload.quantity;
      const existItem = state.cartItems.find((item) => item._id === newItem._id);

      const updatedItem = existItem
        ? state.cartItems.map((item) =>
            item._id === existItem._id
              ? { ...item, quantity: quantity   }
              : item
          )
        : [...state.cartItems, { ...newItem, quantity: 1 }];
      return { ...state, cartItems: updatedItem };
    },
    removeCart :(state, action)=>{
    const removedItems =  state.cartItems.filter((item)=> item._id !== action.payload)
      return {...state, cartItems: removedItems}
    },
    clearCart: (state) => {
      state.cartItems = []
    },
     
  },
});

export const { addCart,  removeCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
