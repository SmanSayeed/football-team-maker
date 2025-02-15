
// src/components/Team/TeamOverview.jsx
import { 
    Box, 
    Typography, 
    Paper,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton
  } from '@mui/material';
  import { useSelector } from 'react-redux';
  import { selectPlayers, selectFormation, selectTotalBudget } from '../../redux/slices/teamSlice';
  import InfoIcon from '@mui/icons-material/Info';
  import { useState } from 'react';
  import PlayerInfoModal from './PlayerInfoModal';
  
  const TeamOverview = () => {
    const players = useSelector(selectPlayers);
    const formation = useSelector(selectFormation);
    const totalBudget = useSelector(selectTotalBudget);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
  
    const handlePlayerInfo = (player) => {
      setSelectedPlayer(player);
      setInfoModalOpen(true);
    };
  
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Team Overview
          </Typography>
  
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Formation</Typography>
                  <Typography variant="h4">{formation}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Budget</Typography>
                  <Typography variant="h4">{totalBudget.toFixed(1)}M €</Typography>
                </CardContent>
              </Card>
            </Grid>
            
          </Grid>
  
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2
            }}
          >
            {Object.entries(players).map(([category, categoryPlayers]) => {
              const playersList = Array.isArray(categoryPlayers) ? categoryPlayers : [categoryPlayers];
              if (!playersList.length || !playersList[0]) return null;
  
              return (
                <Box key={category}>
                  <Typography variant="h6" gutterBottom>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                  {playersList.map((player) => (
                    <Card key={player.id} sx={{ mb: 1 }}>
                      <CardContent sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        p: '8px !important'
                      }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 40, height: 40, borderRadius: 1 }}
                          image={player.playerImage}
                          alt={player.playerName}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {player.playerName}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => handlePlayerInfo(player)}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Paper>
  
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
  
  export default TeamOverview;