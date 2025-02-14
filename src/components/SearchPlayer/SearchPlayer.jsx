import { Box, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import SearchInput from "../../submodule/ui/SearchInput/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { setPlayers, selectPlayers } from "../../redux/slices/playersSlice";
import { useSearchPlayersQuery, useGetPlayersQuery } from "../../redux/apis/apiSlice";
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';

export default function SearchPlayer() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const dispatch = useDispatch();
  const allPlayers = useSelector(selectPlayers);

  // Get initial players data
  const { data: initialPlayersData } = useGetPlayersQuery();

  // Search query with skip option
  const { data: searchData, isFetching } = useSearchPlayersQuery(searchTerm, {
    skip: !searchTerm || searchTerm.length < 3,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 500),
    []
  );

  // Handle input change
  const handleSearch = useCallback((event) => {
    const value = event.target.value;
    setInputValue(value);
    setShowClear(!!value);
    
    if (value.length >= 3) {
      debouncedSearch(value);
    } else if (value.length === 0) {
      // Reset to initial players when search is cleared
      if (initialPlayersData?.data?.player) {
        dispatch(setPlayers(initialPlayersData.data.player));
      }
      setSearchTerm("");
      setShowClear(false);
    }
  }, [debouncedSearch, dispatch, initialPlayersData]);

  // Update players in Redux when search results arrive
  useEffect(() => {
    let isMounted = true;

    if (searchTerm && searchData?.data?.players && allPlayers.length > 0) {
      // Extract IDs from search results
      const searchResultIds = searchData.data.players.map(player => player.id);
      
      // Filter players from Redux state by matching IDs and maintain search order
      const matchedPlayers = searchResultIds
        .map(searchId => allPlayers.find(player => player.id === searchId))
        .filter(Boolean);

      if (isMounted && matchedPlayers.length > 0) {
        dispatch(setPlayers(matchedPlayers));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [searchData, dispatch, searchTerm, allPlayers]);

  const endAdornment = showClear ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => {
          setInputValue("");
          setSearchTerm("");
          setShowClear(false);
          if (initialPlayersData?.data?.player) {
            dispatch(setPlayers(initialPlayersData.data.player));
          }
        }}
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
        InputProps={{ endAdornment }}
        sx={{
          '& .MuiOutlinedInput-root': {
            pr: showClear ? 1 : 2,
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