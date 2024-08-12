import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'searchproducts',
  initialState: {
    searchproducts: [],
    searchedLocation: '',
  },
  reducers: {
    searchSuccess: (state, action) => {
      state.searchproducts = action.payload;
      
    
      
    },
    searchAddress:(state, action) => {
      state.searchedLocation = action.payload;
    },
    clearLocation: (state) => {
      state.searchedLocation = '';
    },
  },
});

export const { searchSuccess, searchAddress, clearLocation } = searchSlice.actions;
export default searchSlice.reducer;
