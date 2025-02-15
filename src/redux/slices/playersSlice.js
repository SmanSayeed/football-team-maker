// playersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  players: [],
  filteredPlayers: null, // null when no search is active, array when filtering
};

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setFilteredPlayers: (state, action) => {
      state.filteredPlayers = action.payload;
    },
  },
});

export const { setPlayers, setFilteredPlayers } = playersSlice.actions;
export const selectPlayers = (state) => state.players.players;
export const selectFilteredPlayers = (state) => state.players.filteredPlayers;
export default playersSlice.reducer;  