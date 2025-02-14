import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apis/apiSlice';
import countryReducer from './slices/countrySlice';
import playersReducer from './slices/playersSlice';
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

const persistConfig = {
  key: 'root',
  storage,
};

const persistedCountryReducer = persistReducer(persistConfig, countryReducer);
// const persistedPlayersReducer = persistReducer(persistConfig, playersReducer);

export const store = configureStore({
  reducer: {
    countries: persistedCountryReducer,
    players: playersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);