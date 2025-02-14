// src/hooks/usePlayers.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayers, setPlayers } from '../redux/slices/playersSlice';
import { useGetPlayersQuery } from '../redux/apis/apiSlice';

export const usePlayers = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);

  // Only call the API if players are not already in Redux
  const { data: playersData, isSuccess: isPlayersSuccess } = useGetPlayersQuery(
    undefined,
    {
      skip: players.length > 0,
    }
  );

  useEffect(() => {
    if (!players.length && isPlayersSuccess && playersData?.data?.player.length) {
      dispatch(setPlayers(playersData?.data?.player));
    }
  }, [players, playersData, isPlayersSuccess, dispatch]);

  // Add functions for filtering and searching
  const searchPlayers = (searchTerm) => {
    if (!playersData?.data?.player) return;
    
    const filteredPlayers = playersData.data.player.filter(player => 
      player.playerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setPlayers(filteredPlayers));
  };

  const filterPlayers = ({ country, club, minValue, maxValue, minAge, maxAge }) => {
    if (!playersData?.data?.player) return;

    const filteredPlayers = playersData.data.player.filter(player => {
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

    dispatch(setPlayers(filteredPlayers));
  };

  const resetPlayers = () => {
    if (playersData?.data?.player) {
      dispatch(setPlayers(playersData.data.player));
    }
  };

  return {
    players,
    searchPlayers,
    filterPlayers,
    resetPlayers,
    isLoading: !isPlayersSuccess
  };
};