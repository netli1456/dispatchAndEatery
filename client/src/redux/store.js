// store.js

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userInfoReducers from './userSlice';
import cartReducer from './cartSlice';
import shippingAddressReducers from './shippingSlice';
import searchReducers from './searchSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userInfoReducers,
  shippingAddress: shippingAddressReducers,
  searching: searchReducers,

  // Add more reducers as needed
});

const persistConfig = {
  key: 'root',
  storage,
  // Add blacklist or whitelist options if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
