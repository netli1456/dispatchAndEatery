import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'searchproducts',
  initialState: {
    searchproducts: [],
    searchedLocation: '', 
    pagecounts: 0, 
  },
  reducers: {
    searchSuccess: (state, action) => {
      const newProduct = action.payload;

      newProduct.forEach((newp) => {
        const existProduct = state.searchproducts.find(
          (p) => p._id === newp._id
        );

        if (!existProduct) {
          state.searchproducts.push(newp);
        }
      });
    },
    resetProducts: (state, action) => {
      // Reset the product list with new data (e.g., on new search)
      state.searchproducts = action.payload;
    },
    searchAddress: (state, action) => {
      // Update the searched location
      state.searchedLocation = action.payload;
    },
    clearLocation: (state) => {
      // Clear the location field
      state.searchedLocation = '';
    },
    pageSuccess: (state, action) => {
      // Update total pages available
      state.pagecounts = action.payload;
    },
  },
});

export const {
  searchSuccess,
  resetProducts,
  searchAddress,
  clearLocation,
  pageSuccess,
} = searchSlice.actions;
export default searchSlice.reducer;
