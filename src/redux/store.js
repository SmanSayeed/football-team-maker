// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apis/apiSlice';
import countryReducer from './slices/countrySlice';
import playersReducer from './slices/playersSlice';
import clubsReducer from './slices/clubSlice';
import teamReducer from './slices/teamSlice';
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

// Root persist config for existing reducers
const persistConfig = {
  key: 'root',
  storage,
};

// Separate persist config for team reducer
const teamPersistConfig = {
  key: 'team',
  storage,
  whitelist: ['formation', 'players', 'totalBudget', 'averageAge'] // Only persist these fields
};

// Create persisted reducers
const persistedCountryReducer = persistReducer(persistConfig, countryReducer);
const persistedTeamReducer = persistReducer(teamPersistConfig, teamReducer);

// Configure store with all reducers
export const store = configureStore({
  reducer: {
    countries: persistedCountryReducer,
    clubs: clubsReducer,
    players: playersReducer,
    team: persistedTeamReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development only
});

// Create persistor
export const persistor = persistStore(store);

// Export types
// export  RootState = ReturnType<typeof store.getState>;
// export  AppDispatch = typeof store.dispatch;