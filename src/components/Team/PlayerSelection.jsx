
// src/components/Team/PlayerSelection.jsx
import { 
    Box, 
    Typography,
    Divider,
    Alert
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  import { selectPlayers } from '../../redux/slices/teamSlice';
  import PlayerCategorySection from './PlayerCategorySection';
  
  const formationLimits = {
    '4-3-3': { defenders: 4, midfielders: 3, forwards: 3 },
    '4-4-2': { defenders: 4, midfielders: 4, forwards: 2 },
    '3-4-3': { defenders: 3, midfielders: 4, forwards: 3 },
    '5-2-3': { defenders: 5, midfielders: 2, forwards: 3 },
    '5-3-2': { defenders: 5, midfielders: 3, forwards: 2 }
  };
  
  const PlayerSelection = ({ formation, validations }) => {
    const players = useSelector(selectPlayers);
    const limits = formationLimits[formation];
  
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Players
        </Typography>
  
        <Box sx={{ mb: 3 }}>
          <PlayerCategorySection
            title="Goalkeeper"
            category="goalkeeper"
            current={players.goalkeeper ? 1 : 0}
            limit={1}
            validations={validations}
            showTable={!!players.goalkeeper}
          />
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box sx={{ mb: 3 }}>
          <PlayerCategorySection
            title="Defenders"
            category="defenders"
            current={players.defenders.length}
            limit={limits.defenders}
            validations={validations}
            showTable={players.defenders.length > 0}
          />
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box sx={{ mb: 3 }}>
          <PlayerCategorySection
            title="Midfielders"
            category="midfielders"
            current={players.midfielders.length}
            limit={limits.midfielders}
            validations={validations}
            showTable={players.midfielders.length > 0}
          />
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box sx={{ mb: 3 }}>
          <PlayerCategorySection
            title="Forwards"
            category="forwards"
            current={players.forwards.length}
            limit={limits.forwards}
            validations={validations}
            showTable={players.forwards.length > 0}
          />
        </Box>
      </Box>
    );
  };
  
  export default PlayerSelection;