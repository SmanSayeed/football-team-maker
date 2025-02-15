// src/components/Team/PlayerSection.jsx
import { Box } from '@mui/material';
import PlayerPosition from './PlayerPosition';

const PlayerSection = ({
  category,
  players,
  positions,
  bottomPosition,
  onAddPlayer,
  onRemovePlayer,
  onPlayerClick
}) => {
  return (
    <Box sx={{ position: 'absolute', bottom: bottomPosition, width: '100%' }}>
      {positions.map((pos, index) => (
        <PlayerPosition
          key={`${category}-${pos}`}
          player={players[index]}
          position={pos}
          category={category}
          onAddPlayer={onAddPlayer}
          onRemovePlayer={onRemovePlayer}
          onPlayerClick={onPlayerClick}
        />
      ))}
    </Box>
  );
};

export default PlayerSection;
