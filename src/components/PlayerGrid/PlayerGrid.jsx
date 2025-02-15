
// src/components/PlayerGrid/PlayerGrid.jsx
import { useState, useCallback, useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { selectPlayers, selectFilteredPlayers } from '../../redux/slices/playersSlice';
import PlayerCard from '../../submodule/ui/PlayerCard/PlayerCard';
import Modal from '../../submodule/ui/Modal/Modal';
import PlayerInfo from '../PlayerInfo/PlayerInfo';
import Loader from '../../submodule/ui/Loader/Loader';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePlayers } from '../../hooks/usePlayers';
import { usePlayerFiltering } from '../../hooks/usePlayerFiltering';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import PlayerTabs from '../PlayerTabs/PlayerTabs';
import { TABS } from '../../constants/playerConstants';
import PlayerFilters from '../PlayerFilter/PlayerFilter';

const PlayerGrid = () => {
  const allPlayers = useSelector(selectPlayers);
  const searchFilteredPlayers = useSelector(selectFilteredPlayers);
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { resetPlayers } = usePlayers();
  
  const {
    activeFilters,
    filterPlayersByPosition,
    handleApplyFilters,
    handleClearFilters
  } = usePlayerFiltering(allPlayers);

  const basePlayerSet = useMemo(() => {
    return activeFilters ? searchFilteredPlayers : (searchFilteredPlayers || allPlayers);
  }, [searchFilteredPlayers, allPlayers, activeFilters]);

  const currentPlayers = useMemo(() => {
    return filterPlayersByPosition(basePlayerSet, selectedTab);
  }, [filterPlayersByPosition, basePlayerSet, selectedTab]);

  const { displayedPlayers, loading, lastPlayerRef, setPage } = useInfiniteScroll(currentPlayers);

  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
    setPage(1);
  }, [setPage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await resetPlayers();
      setSelectedTab(0);
      setPage(1);
      handleClearFilters();
    } catch (error) {
      console.error('Failed to refresh players:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCardClick = useCallback((player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedPlayer(null), 300);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <PlayerFilters 
        onFilter={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <PlayerTabs 
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />

        <Tooltip title="Refresh players">
          <span>
            <IconButton 
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{
                ml: 2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              <RefreshIcon 
                sx={{ 
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} 
              />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {(!currentPlayers?.length && !loading && !isRefreshing) ? (
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            No players found in {TABS[selectedTab]}
          </Box>
        </Box>
      ) : (
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
      )}

      {(loading || isRefreshing) && (
        <Box sx={{ p: 3 }}>
          <Loader text={isRefreshing ? "Refreshing players..." : "Loading more players..."} />
        </Box>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={selectedPlayer?.playerName || 'Player Details'}
        maxWidth="lg"
      >
        {selectedPlayer && <PlayerInfo playerId={selectedPlayer.id} />}
      </Modal>
    </Box>
  );
};

export default PlayerGrid;