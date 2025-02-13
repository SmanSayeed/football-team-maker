import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config/config';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', config.X_RAPID_API_KEY);
      headers.set('X-RapidAPI-Host', config.X_RAPID_API_HOST);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    
    getPlayers: builder.query({
      query: () => `markets/best-players?locale=US`,
    }),
    getCountries: builder.query({
      query: () => '/static/countries?locale=US',
    }),
  }),
});

export const { useGetTeamsQuery, useGetPlayersQuery, useGetCountriesQuery } = apiSlice;