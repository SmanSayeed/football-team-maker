// usePlayers.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayers, setPlayers, setFilteredPlayers } from '../redux/slices/playersSlice';
import { useGetPlayersQuery } from '../redux/apis/apiSlice';

export const usePlayers = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);
  const initialFetchDone = useRef(false);

  const { 
    data: playersData, 
    isSuccess: isPlayersSuccess,
    refetch,
    isLoading: isRefetching 
  } = useGetPlayersQuery(undefined, {
    refetchOnMountOrArgChange: true // Ensure we can refetch when needed
  });

  useEffect(() => {
    // Handle initial data fetch
    if (isPlayersSuccess && playersData?.data?.player && !initialFetchDone.current) {
      const processedPlayers = playersData.data.player.map(player => ({
        id: player.id,
        playerName: player.playerName || player.name,
        playerImage: player.playerImage,
        clubName: player.clubName || player.club,
        clubImage: player.clubImage,
        countryImage: player.countryImage || player.nationImage,
        mainPosition: player.mainPosition || player.position,
        ageAtThisTime: player.ageAtThisTime || player.age,
        marketValueAtThisTime: player.marketValueAtThisTime || player.marketValue,
        marketValueAtThisTimeCurrency: player.marketValueAtThisTimeCurrency || '€',
        marketValueAtThisTimeNumeral: player.marketValueAtThisTimeNumeral || 'M'
      }));
      
      dispatch(setPlayers(processedPlayers));
      initialFetchDone.current = true;
    }
  }, [playersData, isPlayersSuccess, dispatch]);

  const filterPlayers = ({ country, club, minValue, maxValue, minAge, maxAge }) => {
    if (!players?.length) return;

    const filteredPlayers = players.filter(player => {
      const marketValue = parseFloat(player.marketValueAtThisTime);
      const age = parseInt(player.ageAtThisTime);
      
      return (
        (!country || player.countryID === country) &&
        (!club || player.clubID === club) &&
        (!minValue || marketValue >= minValue) &&
        (!maxValue || marketValue <= maxValue) &&
        (!minAge || age >= minAge) &&
        (!maxAge || age <= maxAge)
      );
    });

    dispatch(setFilteredPlayers(filteredPlayers));
  };

  const resetPlayers = async () => {
    try {
      // Clear filtered players first
      dispatch(setFilteredPlayers(null));
      
      // Refetch players data
      const result = await refetch();
      
      if (result.data?.data?.player) {
        const processedPlayers = result.data.data.player.map(player => ({
          id: player.id,
          playerName: player.playerName || player.name,
          playerImage: player.playerImage,
          clubName: player.clubName || player.club,
          clubImage: player.clubImage,
          countryImage: player.countryImage || player.nationImage,
          mainPosition: player.mainPosition || player.position,
          ageAtThisTime: player.ageAtThisTime || player.age,
          marketValueAtThisTime: player.marketValueAtThisTime || player.marketValue,
          marketValueAtThisTimeCurrency: player.marketValueAtThisTimeCurrency || '€',
          marketValueAtThisTimeNumeral: player.marketValueAtThisTimeNumeral || 'M'
        }));
        
        dispatch(setPlayers(processedPlayers));
      }
      
      return result;
    } catch (error) {
      console.error('Error refetching players:', error);
      throw error;
    }
  };

  return {
    players,
    filterPlayers,
    resetPlayers,
    isLoading: !isPlayersSuccess || isRefetching,
    isSuccess: isPlayersSuccess
  };
};