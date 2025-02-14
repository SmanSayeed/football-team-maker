import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayers, setPlayers } from '../redux/slices/playersSlice';
import { useGetPlayersQuery } from '../redux/apis/apiSlice';

export const usePlayers = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);
  const initialFetchDone = useRef(false);

  // Remove the skip option to allow refetching
  const { 
    data: playersData, 
    isSuccess: isPlayersSuccess,
    refetch,
    isLoading: isRefetching 
  } = useGetPlayersQuery();

  useEffect(() => {
    // Only update Redux on initial fetch or when explicitly refetching
    if (isPlayersSuccess && playersData?.data?.player && !initialFetchDone.current) {
      dispatch(setPlayers(playersData.data.player));
      initialFetchDone.current = true;
    }
  }, [playersData, isPlayersSuccess, dispatch]);

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

  const resetPlayers = async () => {
    try {
      const result = await refetch();
      if (result.data?.data?.player) {
        dispatch(setPlayers(result.data.data.player));
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
    isLoading: !isPlayersSuccess || isRefetching
  };
};