// src/hooks/useClubs.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectClubs, setClubs } from '../redux/slices/clubSlice';
import { useGetClubsQuery } from '../redux/apis/apiSlice';

export const useClubs = () => {
  const dispatch = useDispatch();
  const clubs = useSelector(selectClubs);

  const { data: clubsData, isSuccess: isClubsSuccess } = useGetClubsQuery(
    undefined,
    {
      skip: clubs.length > 0,
    }
  );

  useEffect(() => {
    // console.log("clubsData", clubsData?.data);

    if (!clubs.length && isClubsSuccess) {
      if(clubsData?.data){
        dispatch(setClubs(clubsData?.data));
      }
    }
  }, [clubs, clubsData, isClubsSuccess, dispatch]);

  return {
    clubs,
    isLoading: !isClubsSuccess
  };
};