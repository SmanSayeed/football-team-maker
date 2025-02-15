// src/components/Team/PlayerSelectionModal.jsx
import { useState, useMemo } from 'react';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert
} from '@mui/material';
import Modal from '../../submodule/ui/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { usePlayers } from '../../hooks/usePlayers';
import { addPlayer, setGoalkeeper, selectPlayers } from '../../redux/slices/teamSlice';
import SearchInput from '../../submodule/ui/SearchInput/SearchInput';

const POSITION_MAPPINGS = {
  'goalkeeper': ['Goalkeeper'],
  'defenders': ['Centre-Back', 'Right-Back', 'Left-Back', 'Sweeper'],
  'midfielders': ['Attacking Midfield', 'Central Midfield', 'Defensive Midfield', 'Right Midfield', 'Left Midfield'],
  'forwards': ['Centre-Forward', 'Second Striker', 'Right Winger', 'Left Winger']
};

const getPositionDisplayName = (category) => {
  if (!category) return 'Select Player';
  
  // Remove 's' from the end if it exists and capitalize first letter
  const singularForm = category.endsWith('s') ? category.slice(0, -1) : category;
  return singularForm.charAt(0).toUpperCase() + singularForm.slice(1);
};

const PlayerSelectionModal = ({ 
  open, 
  onClose, 
  category = '',
  validations,
  limit,
  current
}) => {
  const dispatch = useDispatch();
  const { players, isLoading } = usePlayers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const teamPlayers = useSelector(selectPlayers);

  const eligiblePlayers = useMemo(() => {
    if (!players || !category) return [];

    const positionFilter = player => 
      POSITION_MAPPINGS[category]?.some(position => 
        player.mainPosition?.includes(position) || 
        position.includes(player.mainPosition)
      ) || false;

    // Get all selected player IDs to exclude
    const selectedIds = new Set([
      ...teamPlayers.defenders.map(p => p.id),
      ...teamPlayers.midfielders.map(p => p.id),
      ...teamPlayers.forwards.map(p => p.id),
      teamPlayers.goalkeeper?.id
    ].filter(Boolean));

    return players
      .filter(player => 
        !selectedIds.has(player.id) &&
        (!searchTerm || 
          player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.clubName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => b.marketValueAtThisTime - a.marketValueAtThisTime);
  }, [players, category, searchTerm, teamPlayers]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmSelection = () => {
    if (!selectedPlayer || !category) return;

    if (category === 'goalkeeper') {
      dispatch(setGoalkeeper(selectedPlayer));
    } else {
      dispatch(addPlayer({ position: category, player: selectedPlayer }));
    }
    onClose();
  };

  const validateSelection = (player) => {
    if (!player) return { valid: false, message: 'No player selected' };
    if (!category) return { valid: false, message: 'No position selected' };

    const allPlayers = [
      ...teamPlayers.defenders,
      ...teamPlayers.midfielders,
      ...teamPlayers.forwards,
      teamPlayers.goalkeeper
    ].filter(Boolean);

    // Count players from same club and country
    const clubCount = allPlayers.filter(p => p.clubName === player.clubName).length;
    const countryCount = allPlayers.filter(p => p.countryImage === player.countryImage).length;

    if (clubCount >= 2) {
      return { 
        valid: false, 
        message: `Cannot select more than 2 players from ${player.clubName}` 
      };
    }

    if (countryCount >= 2) {
      return { 
        valid: false, 
        message: 'Cannot select more than 2 players from the same country' 
      };
    }

    return { valid: true };
  };

  const selectionValidation = selectedPlayer ? validateSelection(selectedPlayer) : null;

  // Reset state when modal closes
  const handleClose = () => {
    setSearchTerm('');
    setSelectedPlayer(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={getPositionDisplayName(category)}
      maxWidth="md"
    >
      {category ? (
        <>
          <Box sx={{ mb: 3 }}>
            <SearchInput
              placeholder="Search by player or club name..."
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </Box>

          {selectedPlayer && !selectionValidation?.valid && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {selectionValidation.message}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Club</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Market Value</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eligiblePlayers.map((player) => (
                  <TableRow 
                    key={player.id}
                    selected={selectedPlayer?.id === player.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSelectPlayer(player)}
                  >
                    <TableCell>{player.playerName}</TableCell>
                    <TableCell>{player.ageAtThisTime}</TableCell>
                    <TableCell>{player.clubName}</TableCell>
                    <TableCell>
                      <img 
                        src={player.countryImage} 
                        alt="country"
                        style={{ width: 20, height: 'auto' }}
                      />
                    </TableCell>
                    <TableCell>{player.mainPosition}</TableCell>
                    <TableCell>
                      {player.marketValueAtThisTime}
                      {player.marketValueAtThisTimeCurrency}
                      {player.marketValueAtThisTimeNumeral}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSelectPlayer(player)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmSelection}
              disabled={!selectedPlayer || !selectionValidation?.valid}
            >
              Confirm Selection
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">
            No position category selected. Please try again.
          </Typography>
        </Box>
      )}
    </Modal>
  );
};

export default PlayerSelectionModal;