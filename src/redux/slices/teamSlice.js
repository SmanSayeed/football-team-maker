// src/redux/slices/teamSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formation: '',
  players: {
    defenders: [],
    midfielders: [],
    forwards: [],
    goalkeeper: null
  },
  totalBudget: 0,
  averageAge: 0
};

const formationLimits = {
  '4-3-3': { defenders: 4, midfielders: 3, forwards: 3 },
  '4-4-2': { defenders: 4, midfielders: 4, forwards: 2 },
  '3-4-3': { defenders: 3, midfielders: 4, forwards: 3 },
  '5-2-3': { defenders: 5, midfielders: 2, forwards: 3 },
  '5-3-2': { defenders: 5, midfielders: 3, forwards: 2 }
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setFormation: (state, action) => {
      state.formation = action.payload;
    },
    addPlayer: (state, action) => {
      const { position, player } = action.payload;
      state.players[position].push(player);
      state.totalBudget = calculateTotalBudget(state.players);
      state.averageAge = calculateAverageAge(state.players);
    },
    removePlayer: (state, action) => {
      const { position, playerId } = action.payload;
      state.players[position] = state.players[position].filter(p => p.id !== playerId);
      state.totalBudget = calculateTotalBudget(state.players);
      state.averageAge = calculateAverageAge(state.players);
    },
    setGoalkeeper: (state, action) => {
      state.players.goalkeeper = action.payload;
      state.totalBudget = calculateTotalBudget(state.players);
      state.averageAge = calculateAverageAge(state.players);
    },
    resetTeam: (state) => {
      return initialState;
    }
  }
});

const calculateTotalBudget = (players) => {
  let total = 0;
  Object.values(players).flat().forEach(player => {
    if (player) {
      const value = parseFloat(player.marketValueAtThisTime);
      if (!isNaN(value)) {
        total += value;
      }
    }
  });
  return total;
};

const calculateAverageAge = (players) => {
  const allPlayers = Object.values(players).flat().filter(Boolean);
  if (allPlayers.length === 0) return 0;
  
  const totalAge = allPlayers.reduce((sum, player) => {
    return sum + parseInt(player.ageAtThisTime);
  }, 0);
  
  return totalAge / allPlayers.length;
};

export const { 
  setFormation, 
  addPlayer, 
  removePlayer, 
  setGoalkeeper, 
  resetTeam 
} = teamSlice.actions;

export const selectTeam = (state) => state.team;
export const selectFormation = (state) => state.team.formation;
export const selectPlayers = (state) => state.team.players;
export const selectTotalBudget = (state) => state.team.totalBudget;
export const selectAverageAge = (state) => state.team.averageAge;

export default teamSlice.reducer;
