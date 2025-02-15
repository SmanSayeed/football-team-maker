// src/components/PlayerInfo/PlayerInfo.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Skeleton,
  Grid,
  Avatar
} from '@mui/material';
import { usePlayerInfoQuery } from '../../redux/apis/apiSlice';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const formatMarketValue = (marketValue) => {
  if (!marketValue || !marketValue.value) return 'N/A';
  
  try {
    const value = marketValue.value;
    // For values in millions
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    // For values in thousands
    if (value >= 1000) {
      return `€${(value / 1000).toFixed(1)}K`;
    }
    // For smaller values
    return `€${value.toLocaleString()}`;
  } catch (error) {
    console.error('Error formatting market value:', error);
    return 'N/A';
  }
};

const PlayerInfo = ({ playerId }) => {
  const { data, isLoading, error } = usePlayerInfoQuery(playerId);

  if (isLoading) {
    return <PlayerInfoSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3,
        color: 'error.main'
      }}>
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        <Typography>
          Failed to load player information
        </Typography>
      </Box>
    );
  }

  const { details } = data?.data || {};
  const { player, club } = details || {};

  if (!player) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No player information available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Player Image and Basic Info */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Box
              component="img"
              src={player.imageLarge || player.image}
              alt={player.name}
              onError={(e) => {
                e.target.src = '/api/placeholder/300/300';
              }}
              sx={{
                width: '100%',
                maxWidth: 300,
                height: 'auto',
                borderRadius: 2,
                mb: 2
              }}
            />
            <Typography variant="h5" gutterBottom>
              {player.name}
            </Typography>
            {player.shirtNumber && (
              <Chip 
                label={`#${player.shirtNumber}`}
                color="primary"
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        </Grid>

        {/* Player Details */}
        <Grid item xs={12} md={8}>
          <Box>
            {/* Club Information */}
            {club && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Current Club
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2,
                  mb: 2
                }}>
                  {club.image && (
                    <Avatar
                      src={club.image}
                      alt={club.name}
                      sx={{ width: 48, height: 48 }}
                      imgProps={{
                        onError: (e) => {
                          e.target.src = '/api/placeholder/48/48';
                        }
                      }}
                    />
                  )}
                  <Box>
                    <Typography variant="subtitle1">
                      {club.fullName || club.name}
                    </Typography>
                    {club.mainCompetition && (
                      <Typography variant="body2" color="text.secondary">
                        {club.mainCompetition.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Nationalities */}
            {player.nationalities && player.nationalities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Nationalities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {player.nationalities.map((nationality) => (
                    <Chip
                      key={nationality.id}
                      avatar={
                        <Avatar 
                          src={nationality.image}
                          alt={nationality.name}
                          imgProps={{
                            onError: (e) => {
                              e.target.style.display = 'none';
                            }
                          }}
                        />
                      }
                      label={nationality.name}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Market Value */}
            {player.marketValue && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Market Value
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatMarketValue(player.marketValue)}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const PlayerInfoSkeleton = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="text" height={32} width="80%" sx={{ mx: 'auto' }} />
      <Skeleton variant="rectangular" height={32} width={60} sx={{ mx: 'auto' }} />
    </Grid>
    <Grid item xs={12} md={8}>
      <Skeleton variant="text" height={32} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={72} sx={{ mb: 3 }} />
      <Skeleton variant="text" height={32} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={48} sx={{ mb: 3 }} />
      <Skeleton variant="text" height={32} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={64} />
    </Grid>
  </Grid>
);

export default PlayerInfo;