// src/components/PlayerGrid/PlayerGrid.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { selectPlayers } from '../../redux/slices/playersSlice';
import PlayerCard from '../../submodule/ui/PlayerCard/PlayerCard';
import Loader from '../../submodule/ui/Loader/Loader';

const ITEMS_PER_PAGE = 4;
const LOADING_DELAY = 1000; // 1 second delay

const PlayerGrid = () => {
  const allPlayers = useSelector(selectPlayers);
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const timerRef = useRef();

  // Last element ref callback for intersection observer
  const lastPlayerRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedPlayers.length < allPlayers.length) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, displayedPlayers.length, allPlayers.length]);

  // Load more players when page changes
  useEffect(() => {
    if (!allPlayers?.length) return;
    
    setLoading(true);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a minimum loading time
    timerRef.current = setTimeout(() => {
      const start = 0;
      const end = page * ITEMS_PER_PAGE;
      const newPlayers = allPlayers.slice(start, end);
      
      setDisplayedPlayers(newPlayers);
      setLoading(false);
    }, LOADING_DELAY);

    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page, allPlayers]);

  const handleCardClick = (player) => {
    // Handle card click - to be implemented for showing full details
    console.log('Player clicked:', player);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Grid container spacing={3}>
        {displayedPlayers.map((player, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            // Create unique key by combining id and year
            key={`${player.id}-${player.year}`}
            ref={index === displayedPlayers.length - 1 ? lastPlayerRef : null}
          >
            <PlayerCard 
              player={player} 
              onClick={() => handleCardClick(player)}
            />
          </Grid>
        ))}
      </Grid>
      
      {loading && (
        <Box sx={{ p: 3 }}>
          <Loader text="Loading more players..." />
        </Box>
      )}
    </Box>
  );
};

export default PlayerGrid;