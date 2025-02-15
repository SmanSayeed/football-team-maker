// PlayerGrid.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { selectPlayers, selectFilteredPlayers } from '../../redux/slices/playersSlice';
import PlayerCard from '../../submodule/ui/PlayerCard/PlayerCard';
import Loader from '../../submodule/ui/Loader/Loader';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePlayers } from '../../hooks/usePlayers';

const ITEMS_PER_PAGE = 20;
const LOADING_DELAY = 500; // Reduced from 1000ms to 500ms for better responsiveness

const processPlayerData = (player) => {
  if (!player) return null;
  return {
    ...player,
    imageUrl: player.imageUrl && player.imageUrl.trim() !== '' ? player.imageUrl : null,
    clubImageUrl: player.clubImageUrl && player.clubImageUrl.trim() !== '' ? player.clubImageUrl : null,
    countryImageUrl: player.countryImageUrl && player.countryImageUrl.trim() !== '' ? player.countryImageUrl : null,
  };
};

const PlayerGrid = () => {
  const allPlayers = useSelector(selectPlayers);
  const filteredPlayers = useSelector(selectFilteredPlayers);
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const observer = useRef();
  const timerRef = useRef();
  
  const { resetPlayers } = usePlayers();

  // Get the current players to display (either filtered or all)
  const currentPlayers = filteredPlayers || allPlayers;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    setPage(1);
    setDisplayedPlayers([]);
    
    try {
      await resetPlayers();
    } catch (error) {
      console.error('Failed to refresh players:', error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const lastPlayerRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedPlayers.length < currentPlayers.length) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, displayedPlayers.length, currentPlayers.length]);

  // Reset page when switching between filtered and all players
  useEffect(() => {
    setPage(1);
    setDisplayedPlayers([]);
  }, [filteredPlayers]);

  useEffect(() => {
    if (!currentPlayers?.length) return;
    
    setLoading(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const start = 0;
      const end = page * ITEMS_PER_PAGE;
      
      const processedPlayers = currentPlayers
        .slice(start, end)
        .map(processPlayerData)
        .filter(Boolean); // Remove any null values
      
      setDisplayedPlayers(processedPlayers);
      setLoading(false);
    }, LOADING_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page, currentPlayers]);

  const handleCardClick = (player) => {
    console.log('Player clicked:', player);
    // Implement modal display logic here
  };

  if (!currentPlayers?.length && !loading && !isRefreshing) {
    return (
      <Box sx={{ 
        flexGrow: 1, 
        py: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          No players found
          <IconButton 
            onClick={handleRefresh}
            sx={{ ml: 1 }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Tooltip title="Refresh players">
          <IconButton 
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            <RefreshIcon 
              sx={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': {
                    transform: 'rotate(0deg)',
                  },
                  '100%': {
                    transform: 'rotate(360deg)',
                  },
                },
              }} 
            />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {displayedPlayers.map((player, index) => (
          <Grid 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={`${player.id}-${index}`}
            ref={index === displayedPlayers.length - 1 ? lastPlayerRef : null}
          >
            <PlayerCard 
              player={player} 
              onClick={() => handleCardClick(player)}
            />
          </Grid>
        ))}
      </Grid>
      
      {(loading || isRefreshing) && (
        <Box sx={{ p: 3 }}>
          <Loader text={isRefreshing ? "Refreshing players..." : "Loading more players..."} />
        </Box>
      )}
    </Box>
  );
};

export default PlayerGrid;