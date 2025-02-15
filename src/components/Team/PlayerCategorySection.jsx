// src/components/Team/PlayerCategorySection.jsx
import { 
    Box, 
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Avatar,
    Chip,
    Alert
  } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import InfoIcon from '@mui/icons-material/Info';
  import { useState } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { selectPlayers, removePlayer, setGoalkeeper } from '../../redux/slices/teamSlice';
  import PlayerSelectionModal from './PlayerSelectionModal';
  import PlayerInfoModal from './PlayerInfoModal';
  
  const PlayerCategorySection = ({ 
    title, 
    category, 
    current, 
    limit,
    validations,
    showTable 
  }) => {
    const dispatch = useDispatch();
    const [selectionModalOpen, setSelectionModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const players = useSelector(selectPlayers);
  
    // Handle player removal from team
    const handleRemovePlayer = (playerId) => {
      if (category === 'goalkeeper') {
        dispatch(setGoalkeeper(null));
      } else {
        dispatch(removePlayer({ position: category, playerId }));
      }
    };
  
    // Open player info modal
    const handlePlayerInfo = (player) => {
      setSelectedPlayer(player);
      setInfoModalOpen(true);
    };
  
    // Get players for current category
    const categoryPlayers = category === 'goalkeeper' 
      ? (players.goalkeeper ? [players.goalkeeper] : [])
      : players[category];
  
    // Format market value for display
    const formatMarketValue = (value, currency, numeral) => {
      return `${value}${currency}${numeral}`;
    };
  
    return (
      <Box>
        {/* Category Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2 
        }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {title} ({current}/{limit})
            </Typography>
            {current > 0 && (
              <Typography variant="body2" color="text.secondary">
                Selected {current} out of maximum {limit} players
              </Typography>
            )}
          </Box>
          
          <Button 
            variant="contained"
            onClick={() => setSelectionModalOpen(true)}
            disabled={current >= limit}
            sx={{
              minWidth: 120,
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'text.disabled'
              }
            }}
          >
            Add {title}
          </Button>
        </Box>
  
        {/* Players Table */}
        {showTable && (
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: 3,
              '& .MuiTableRow-root:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Club</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Market Value</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={player.playerImage} 
                          alt={player.playerName}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {player.playerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {player.ageAtThisTime}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {player.clubImage && (
                          <Avatar 
                            src={player.clubImage} 
                            alt={player.clubName}
                            sx={{ width: 20, height: 20 }}
                          />
                        )}
                        <Typography variant="body2">
                          {player.clubName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {player.countryImage && (
                        <img 
                          src={player.countryImage} 
                          alt="country"
                          style={{ width: 20, height: 'auto' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={player.mainPosition}
                        size="small"
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {formatMarketValue(
                        player.marketValueAtThisTime,
                        player.marketValueAtThisTimeCurrency,
                        player.marketValueAtThisTimeNumeral
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Player Info">
                          <IconButton 
                            size="small"
                            onClick={() => handlePlayerInfo(player)}
                            sx={{
                              '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'primary.light'
                              }
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Player">
                          <IconButton 
                            size="small"
                            onClick={() => handleRemovePlayer(player.id)}
                            color="error"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.light'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
  
        {/* Category Validation Alerts */}
        {!validations.budgetValid && current > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Total team budget exceeds allowable range (300M-700M)
          </Alert>
        )}
  
        {!validations.ageValid && current > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Team average age is outside allowable range (25-27 years)
          </Alert>
        )}
  
        {/* Player Selection Modal */}
        <PlayerSelectionModal
          open={selectionModalOpen}
          onClose={() => setSelectionModalOpen(false)}
          category={category}
          validations={validations}
          limit={limit}
          current={current}
        />
  
        {/* Player Info Modal */}
        <PlayerInfoModal
          open={infoModalOpen}
          onClose={() => {
            setInfoModalOpen(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
        />
      </Box>
    );
  };
  
  export default PlayerCategorySection;