import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clubs: [],
};

export const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    setClubs: (state, action) => {
      state.clubs = action.payload;
    },
  },
});

export const { setClubs } = clubSlice.actions;
export const selectClubs = (state) => state.clubs.clubs;
export default clubSlice.reducer;