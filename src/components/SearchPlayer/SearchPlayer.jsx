// SearchPlayer.jsx
import { Box, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import SearchInput from "../../submodule/ui/SearchInput/SearchInput";
import { useDispatch } from "react-redux";
import { setFilteredPlayers } from "../../redux/slices/playersSlice";
import { useSearchPlayersQuery } from "../../redux/apis/apiSlice";
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';
import { usePlayers } from "../../hooks/usePlayers";

const processSearchResult = (player) => {
  return {
    id: player.id,
    playerName: player.playerName,
    clubName: player.club,
    playerImage: player.playerImage,
    clubImage: player.clubImage || null,
    countryImage: player.nationImage,
    mainPosition: player.position || 'Unknown',
    ageAtThisTime: player.age || 'N/A',
    marketValueAtThisTime: player.marketValue || 'N/A',
    marketValueAtThisTimeCurrency: player.marketValueCurrency || '€',
    marketValueAtThisTimeNumeral: player.marketValueNumeral || 'M'
  };
};

export default function SearchPlayer() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const dispatch = useDispatch();
  const { resetPlayers } = usePlayers();
  const searchRequestCounter = useRef(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data: searchData, isFetching, error } = useSearchPlayersQuery(searchTerm, {
    skip: !searchTerm || searchTerm.length < 3,
    refetchOnMountOrArgChange: true,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (!isMounted.current) return;
      
      if (term.length >= 3) {
        searchRequestCounter.current += 1;
        setSearchTerm(term);
      }
    }, 500),
    []
  );

  const handleSearch = useCallback((event) => {
    const value = event.target.value.trim();
    setInputValue(value);
    setShowClear(!!value);
    
    if (value.length >= 3) {
      debouncedSearch(value);
    } else if (value.length === 0) {
      handleClearSearch();
    }
  }, [debouncedSearch]);

  const handleClearSearch = useCallback(() => {
    if (!isMounted.current) return;
    
    setInputValue("");
    setSearchTerm("");
    setShowClear(false);
    resetPlayers(); // Reset to initial players
  }, [resetPlayers]);

  // Process search results
  useEffect(() => {
    if (!isMounted.current) return;
    
    const currentRequestId = searchRequestCounter.current;

    if (searchTerm && searchData?.data?.players) {
      try {
        // Ensure we're handling the most recent search request
        if (currentRequestId === searchRequestCounter.current) {
          // Process and map search results directly
          const processedPlayers = searchData.data.players
            .map(processSearchResult)
            .filter(Boolean);

          if (isMounted.current) {
            dispatch(setFilteredPlayers(processedPlayers));
          }
        }
      } catch (err) {
        console.error('Error processing search results:', err);
        if (isMounted.current) {
          dispatch(setFilteredPlayers([]));
        }
      }
    }
  }, [searchData, dispatch, searchTerm]);

  // Handle search errors
  useEffect(() => {
    if (error && isMounted.current) {
      console.error('Search API error:', error);
      dispatch(setFilteredPlayers([]));
    }
  }, [error, dispatch]);

  const endAdornment = showClear ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={handleClearSearch}
        sx={{ 
          p: 0.5,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return (
    <Box sx={{ 
      display: { xs: "none", md: "block" }, 
      width: 300,
      position: 'relative'
    }}>
      <SearchInput
        id="player-search"
        name="player-search"
        fullWidth
        placeholder="Search players..."
        value={inputValue}
        onChange={handleSearch}
        disabled={isFetching}
        InputProps={{ 
          endAdornment,
          sx: {
            '& .MuiOutlinedInput-root': {
              pr: showClear ? 1 : 2
            }
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            },
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
            }
          }
        }}
      />
    </Box>
  );
}