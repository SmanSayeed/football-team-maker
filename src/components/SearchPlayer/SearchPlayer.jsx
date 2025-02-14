// src/components/SearchPlayer/SearchPlayer.jsx
import { Box, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import SearchInput from "../../submodule/ui/SearchInput/SearchInput"; // Fixed import path
import { useDispatch, useSelector } from "react-redux";
import { selectPlayers, setPlayers } from "../../redux/slices/playersSlice";
import { useSearchPlayersQuery } from "../../redux/apis/apiSlice";
import ClearIcon from '@mui/icons-material/Clear';
import { usePlayers } from "../../hooks/usePlayers";
import debounce from 'lodash.debounce';

export default function SearchPlayer() {
  const [inputValue, setInputValue] = useState(""); // For immediate UI update
  const [searchTerm, setSearchTerm] = useState(""); // For debounced API call
  const [showClear, setShowClear] = useState(false);
  const allPlayers = useSelector(selectPlayers);
  const dispatch = useDispatch();
  const { resetPlayers } = usePlayers();

  // Use the RTK Query hook with skip option
  const { data: searchData } = useSearchPlayersQuery(searchTerm, {
    skip: !searchTerm || searchTerm.length < 2,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 500),
    []
  );

  // Handle input change
  const handleSearch = (event) => {
    const value = event.target.value;
    setInputValue(value); // Update input value immediately
    setShowClear(!!value);
    
    if (value.length >= 2) {
      debouncedSearch(value);
    } else if (value.length === 0) {
      handleClearSearch();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setShowClear(false);
    resetPlayers();
  };

  // Update players in Redux when search results arrive
  useEffect(() => {
    if (searchData?.data?.players) {
      // Get search result player IDs
      const searchPlayerIds = searchData.data.players.map(player => player.id);
      
      // Filter original players array based on search result IDs
      const matchedPlayers = allPlayers.filter(player => 
        searchPlayerIds.includes(player.id)
      );

      // Update Redux with matched players
      dispatch(setPlayers(matchedPlayers));
    }
  }, [searchData, allPlayers, dispatch]);

  return (
    <Box sx={{ 
      display: { xs: "none", md: "block" }, 
      width: 300,
      position: 'relative'
    }}>
      <SearchInput
        fullWidth
        placeholder="Search players..."
        value={inputValue} // Use inputValue instead of searchTerm
        onChange={handleSearch}
        InputProps={{
          endAdornment: showClear && (
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
          )
        }}
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