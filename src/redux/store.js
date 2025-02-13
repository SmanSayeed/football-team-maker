import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apis/apiSlice';
import countryReducer from './slices/countrySlice';
import playersReducer from './slices/playersSlice';

export const store = configureStore({
  reducer: {
    countries: countryReducer,
    players: playersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});