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
    getTeams: builder.query({
      query: () => 'teams',
    }),
    getPlayers: builder.query({
      query: (teamId) => `teams/${teamId}/players`,
    }),
    getCountries: builder.query({
      query: () => '/static/countries?locale=DE',
    }),
  }),
});

export const { useGetTeamsQuery, useGetPlayersQuery, useGetCountriesQuery } = apiSlice;