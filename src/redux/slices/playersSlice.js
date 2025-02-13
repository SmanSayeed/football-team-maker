import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    players: [],
  }

  export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers: (state, action) => {
            state.players = action.payload
        },
    },
  })
  export const {setPlayers} = playersSlice.actions;
  export const selectPlayers = (state) => state.players.players;
  export default playersSlice.reducer;