
// src/Components/Team/CreateTeam.jsx
import { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setFormation,
  selectFormation,
  selectPlayers,
  selectTotalBudget,
  selectAverageAge
} from '../../redux/slices/teamSlice';
import PlayerSelection from './PlayerSelection';
import TeamOverview from './TeamOverview';

const FORMATIONS = ['4-3-3', '4-4-2', '3-4-3', '5-2-3', '5-3-2'];

const CreateTeam = () => {
  const dispatch = useDispatch();
  const formation = useSelector(selectFormation);
  const players = useSelector(selectPlayers);
  const totalBudget = useSelector(selectTotalBudget);
  const averageAge = useSelector(selectAverageAge);

  const handleFormationChange = (event) => {
    dispatch(setFormation(event.target.value));
  };

  const validations = useMemo(() => {
    const allPlayers = Object.values(players).flat().filter(Boolean);
    const clubCounts = {};
    const countryCounts = {};
    
    allPlayers.forEach(player => {
      clubCounts[player.clubName] = (clubCounts[player.clubName] || 0) + 1;
      countryCounts[player.countryImage] = (countryCounts[player.countryImage] || 0) + 1;
    });

    const clubViolations = Object.entries(clubCounts)
      .filter(([_, count]) => count > 2)
      .map(([club]) => club);

    const countryViolations = Object.entries(countryCounts)
      .filter(([_, count]) => count > 2)
      .map(([country]) => country);

    return {
      budgetValid: totalBudget >= 300 && totalBudget <= 700,
      ageValid: averageAge >= 25 && averageAge <= 27,
      clubValid: clubViolations.length === 0,
      countryValid: countryViolations.length === 0,
      clubViolations,
      countryViolations
    };
  }, [players, totalBudget, averageAge]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Your Team
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Formation</InputLabel>
          <Select
            value={formation}
            onChange={handleFormationChange}
            label="Select Formation"
          >
            {FORMATIONS.map(f => (
              <MenuItem key={f} value={f}>{f}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {!validations.budgetValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Team budget must be between 300M and 700M. Current: {totalBudget.toFixed(1)}M
          </Alert>
        )}

        {!validations.ageValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Team average age must be between 25 and 27. Current: {averageAge.toFixed(1)}
          </Alert>
        )}

        {!validations.clubValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Maximum 2 players allowed from the same club. Violations: {validations.clubViolations.join(', ')}
          </Alert>
        )}

        {!validations.countryValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Maximum 2 players allowed from the same country. Violations: {validations.countryViolations.join(', ')}
          </Alert>
        )}
      </Paper>

      {formation && (
        <>
          <PlayerSelection
            formation={formation}
            validations={validations}
          />
          <TeamOverview />
        </>
      )}
    </Box>
  );
};

export default CreateTeam;