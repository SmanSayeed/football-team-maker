import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    countries: [],
  }

  export const countrySlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {
        setCountries: (state, action) => {
            state.countries = action.payload
        },
    },
  })
  export const {setCountries } = countrySlice.actions;
  export const selectCountries = (state) => state.country.countries;
  export default countrySlice.reducer;