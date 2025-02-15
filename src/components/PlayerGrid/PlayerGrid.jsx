// src/components/PlayerGrid/PlayerGrid.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectPlayers, 
  selectFilteredPlayers,
  setFilteredPlayers 
} from '../../redux/slices/playersSlice';
import PlayerCard from '../../submodule/ui/PlayerCard/PlayerCard';
import Modal from '../../submodule/ui/Modal/Modal';
import PlayerInfo from '../PlayerInfo/PlayerInfo';
import Loader from '../../submodule/ui/Loader/Loader';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePlayers } from '../../hooks/usePlayers';
import PlayerFilters from '../PlayerFilter/PlayerFilter';

const ITEMS_PER_PAGE = 20;
const LOADING_DELAY = 500;

const POSITION_MAPPINGS = {
  'Forwards': ['Centre-Forward', 'Second Striker', 'Right Winger', 'Left Winger'],
  'Midfielders': ['Attacking Midfield', 'Central Midfield', 'Defensive Midfield', 'Right Midfield', 'Left Midfield'],
  'Defenders': ['Centre-Back', 'Right-Back', 'Left-Back', 'Sweeper'],
  'Goalkeepers': ['Goalkeeper']
};

const TABS = ['All Players', 'Forwards', 'Midfielders', 'Defenders', 'Goalkeepers'];

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
  const dispatch = useDispatch();
  const allPlayers = useSelector(selectPlayers);
  const searchFilteredPlayers = useSelector(selectFilteredPlayers);
  
  // Component State
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [positionFilteredPlayers, setPositionFilteredPlayers] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);

  // Refs
  const observer = useRef();
  const timerRef = useRef();
  
  // Custom Hooks
  const { resetPlayers } = usePlayers();

  // Memoized Values
  const basePlayerSet = useMemo(() => {
    if (activeFilters) {
      return searchFilteredPlayers;
    }
    return searchFilteredPlayers || allPlayers;
  }, [searchFilteredPlayers, allPlayers, activeFilters]);

  const filterPlayersByPosition = useCallback((players, tabIndex) => {
    if (!players?.length) return [];
    if (tabIndex === 0) return players;
    
    const categoryPositions = POSITION_MAPPINGS[TABS[tabIndex]];
    return players.filter(player => 
      categoryPositions.some(position => 
        player.mainPosition?.includes(position) || 
        position.includes(player.mainPosition)
      )
    );
  }, []);

  const currentPlayers = useMemo(() => {
    return positionFilteredPlayers || basePlayerSet;
  }, [positionFilteredPlayers, basePlayerSet]);

  // Event Handlers
  const handleTabChange = useCallback((event, newValue) => {
    setSelectedTab(newValue);
    setPage(1);
    setDisplayedPlayers([]);
    
    const filteredByPosition = filterPlayersByPosition(basePlayerSet, newValue);
    setPositionFilteredPlayers(newValue === 0 ? null : filteredByPosition);
  }, [basePlayerSet, filterPlayersByPosition]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    setPage(1);
    setDisplayedPlayers([]);
    setSelectedTab(0);
    setPositionFilteredPlayers(null);
    setActiveFilters(null);
    dispatch(setFilteredPlayers(null));
    
    try {
      await resetPlayers();
    } catch (error) {
      console.error('Failed to refresh players:', error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
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

  const handleApplyFilters = useCallback((filters) => {
    const { country, club, minValue, maxValue, minAge, maxAge } = filters;
    
    if (!allPlayers?.length) return;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    setActiveFilters(hasActiveFilters ? filters : null);

    const filteredPlayers = allPlayers.filter(player => {
      const marketValue = parseFloat(player.marketValueAtThisTime);
      const age = parseInt(player.ageAtThisTime);
      
      return (
        (!country || player.countryID === country) &&
        (!club || player.clubID === club) &&
        (!minValue || marketValue >= parseFloat(minValue)) &&
        (!maxValue || marketValue <= parseFloat(maxValue)) &&
        (!minAge || age >= parseInt(minAge)) &&
        (!maxAge || age <= parseInt(maxAge))
      );
    });

    dispatch(setFilteredPlayers(filteredPlayers));
    setPage(1);
    setDisplayedPlayers([]);
    setSelectedTab(0);
    setPositionFilteredPlayers(null);
  }, [allPlayers, dispatch]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters(null);
    dispatch(setFilteredPlayers(null));
    setPage(1);
    setDisplayedPlayers([]);
    setSelectedTab(0);
    setPositionFilteredPlayers(null);
  }, [dispatch]);

  // Infinite Scroll Logic
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

  // Effects
  useEffect(() => {
    const filteredByPosition = filterPlayersByPosition(basePlayerSet, selectedTab);
    setPositionFilteredPlayers(selectedTab === 0 ? null : filteredByPosition);
    setPage(1);
    setDisplayedPlayers([]);
  }, [basePlayerSet, selectedTab, filterPlayersByPosition]);

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
        .filter(Boolean);
      
      setDisplayedPlayers(processedPlayers);
      setLoading(false);
    }, LOADING_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page, currentPlayers]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          aria-label="player category tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            flexGrow: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
              fontWeight: 600
            }
          }}
        >
          {TABS.map((tab, index) => (
            <Tab 
              key={tab} 
              label={tab}
              id={`player-tab-${index}`}
              aria-controls={`player-tabpanel-${index}`}
            />
          ))}
        </Tabs>

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