
// src/hooks/usePlayerFiltering.js
import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setFilteredPlayers } from '../redux/slices/playersSlice';
import { POSITION_MAPPINGS } from '../constants/playerConstants';
import { parseMarketValue } from '../utils/playerUtils';

export const usePlayerFiltering = (allPlayers) => {
  const dispatch = useDispatch();
  const [activeFilters, setActiveFilters] = useState(null);

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

  const handleApplyFilters = useCallback((filters) => {
    const { country, club, minValue, maxValue, minAge, maxAge } = filters;
    
    if (!allPlayers?.length) return;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    setActiveFilters(hasActiveFilters ? filters : null);

    const filteredPlayers = allPlayers.filter(player => {
      const playerCountryId = player.countryID?.toString();
      const playerClubId = player.clubId?.toString();
      const marketValue = parseMarketValue(player.marketValueAtThisTime);
      const age = parseInt(player.ageAtThisTime) || 0;

      return (!country || playerCountryId === country.toString()) &&
             (!club || playerClubId === club.toString()) &&
             (!minValue || marketValue >= parseFloat(minValue)) &&
             (!maxValue || marketValue <= parseFloat(maxValue)) &&
             (!minAge || age >= parseInt(minAge)) &&
             (!maxAge || age <= parseInt(maxAge));
    });

    dispatch(setFilteredPlayers(filteredPlayers));
  }, [allPlayers, dispatch]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters(null);
    dispatch(setFilteredPlayers(null));
  }, [dispatch]);

  return {
    activeFilters,
    filterPlayersByPosition,
    handleApplyFilters,
    handleClearFilters
  };
};