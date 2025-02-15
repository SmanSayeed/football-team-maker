
// src/components/Team/FieldView.jsx
import { Box, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectPlayers, 
  selectFormation, 
  selectTotalBudget,
  removePlayer, 
  setGoalkeeper 
} from '../../redux/slices/teamSlice';
import { useState } from 'react';
import TeamStats from './TeamStats';
import FieldMarkings from './FieldMarkings';
import PlayerSection from './PlayerSection';
import PlayerInfoModal from './PlayerInfoModal';
import PlayerSelectionModal from './PlayerSelectionModal';

const FORMATION_POSITIONS = {
  '4-3-3': {
    defenders: { count: 4, positions: [25, 41, 58, 75] },
    midfielders: { count: 3, positions: [33, 50, 67] },
    forwards: { count: 3, positions: [33, 50, 67] }
  },
  '4-4-2': {
    defenders: { count: 4, positions: [25, 41, 58, 75] },
    midfielders: { count: 4, positions: [20, 40, 60, 80] },
    forwards: { count: 2, positions: [40, 60] }
  },
  '3-4-3': {
    defenders: { count: 3, positions: [33, 50, 67] },
    midfielders: { count: 4, positions: [20, 40, 60, 80] },
    forwards: { count: 3, positions: [33, 50, 67] }
  },
  '5-2-3': {
    defenders: { count: 5, positions: [20, 35, 50, 65, 80] },
    midfielders: { count: 2, positions: [40, 60] },
    forwards: { count: 3, positions: [33, 50, 67] }
  },
  '5-3-2': {
    defenders: { count: 5, positions: [20, 35, 50, 65, 80] },
    midfielders: { count: 3, positions: [33, 50, 67] },
    forwards: { count: 2, positions: [40, 60] }
  }
};

const FieldView = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);
  const formation = useSelector(selectFormation);
  const totalBudget = useSelector(selectTotalBudget);
 
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setInfoModalOpen(true);
  };

  const handleAddPlayer = (position) => {
    setSelectedPosition(position);
    setSelectionModalOpen(true);
  };

  const handleRemovePlayer = (playerId, category) => {
    if (category === 'goalkeeper') {
      dispatch(setGoalkeeper(null));
    } else {
      dispatch(removePlayer({ position: category, playerId }));
    }
  };

  const getPositionsForCategory = (category) => {
    if (!formation || !FORMATION_POSITIONS[formation]) return [];
    return FORMATION_POSITIONS[formation][category]?.positions || [];
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TeamStats formation={formation} totalBudget={totalBudget} />

      <Paper
        elevation={3}
        sx={{
          aspectRatio: '3/4',
          background: 'linear-gradient(to bottom, #2E7D32, #1B5E20)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            height: '90%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px'
          }
        }}
      >
        <FieldMarkings />

        {/* Goalkeeper - Adjusted position */}
  <PlayerSection
    category="goalkeeper"
    players={[players.goalkeeper]}
    positions={[50]}
    bottomPosition="15%" // Moved up from 5%
    onAddPlayer={handleAddPlayer}
    onRemovePlayer={handleRemovePlayer}
    onPlayerClick={handlePlayerClick}
  />

        {/* Defenders */}
        <PlayerSection
          category="defenders"
          players={players.defenders}
          positions={getPositionsForCategory('defenders')}
          bottomPosition="30%"
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onPlayerClick={handlePlayerClick}
        />

        {/* Midfielders */}
        <PlayerSection
          category="midfielders"
          players={players.midfielders}
          positions={getPositionsForCategory('midfielders')}
          bottomPosition="55%"
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onPlayerClick={handlePlayerClick}
        />

        {/* Forwards */}
        <PlayerSection
          category="forwards"
          players={players.forwards}
          positions={getPositionsForCategory('forwards')}
          bottomPosition="80%"
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handlePlayerClick}
          onPlayerClick={handlePlayerClick}
        />
      </Paper>

      <PlayerInfoModal
        open={infoModalOpen}
        onClose={() => {
          setInfoModalOpen(false);
          setSelectedPlayer(null);
        }}
        player={selectedPlayer}
      />

      <PlayerSelectionModal
        open={selectionModalOpen}
        onClose={() => {
          setSelectionModalOpen(false);
          setSelectedPosition(null);
        }}
        category={selectedPosition}
      />
    </Box>
  );
};

export default FieldView;