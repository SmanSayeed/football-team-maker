// src/hooks/useCountries.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCountries, setCountries } from '../redux/slices/countrySlice';
import { useGetCountriesQuery } from '../redux/apis/apiSlice';

export const useCountries = () => {
  const dispatch = useDispatch();
  const countries = useSelector(selectCountries);

  const { data: countriesData, isSuccess: isCountriesSuccess } = useGetCountriesQuery(
    undefined,
    {
      skip: countries.length > 0,
    }
  );

  useEffect(() => {
    // console.log("countriesData", countriesData?.en);

    if (!countries.length && isCountriesSuccess) {
      if(countriesData?.en){
        dispatch(setCountries(countriesData.en));
      }
    }
  }, [countries, countriesData, isCountriesSuccess, dispatch]);

  return {
    countries,
    isLoading: !isCountriesSuccess
  };
};