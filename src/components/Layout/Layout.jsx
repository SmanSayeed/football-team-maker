// src/components/Layout/Layout.jsx
import { Box, Container, Toolbar } from '@mui/material'
import { Outlet } from 'react-router'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { useEffect } from 'react';
import { selectPlayers, setPlayers } from '../../redux/slices/playersSlice';
import { selectCountries, setCountries } from '../../redux/slices/countrySlice';
import { useGetCountriesQuery, useGetPlayersQuery } from '../../redux/apis/apiSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Layout() {
  const dispatch = useDispatch();
  const countries = useSelector(selectCountries);
  const players = useSelector(selectPlayers);

  // Only call the API if countries are not already in Redux
  const { data: countriesData, isSuccess: isCountriesSuccess } =
    useGetCountriesQuery(undefined, {
      skip: countries.length > 0,
    });

  // Only call the API if players are not already in Redux
  const { data: playersData, isSuccess: isPlayersSuccess } = useGetPlayersQuery(
    undefined,
    {
      skip: players.length > 0,
    }
  );

  useEffect(() => {
    if (!countries.length && isCountriesSuccess) {
      dispatch(setCountries(countriesData));
    }
  }, [countries, countriesData, isCountriesSuccess, dispatch]);

  useEffect(() => {
    
    if (!players.length && isPlayersSuccess && playersData?.data?.player.length) {
      dispatch(setPlayers(playersData?.data?.player));
    }
   
  }, [players, playersData, isPlayersSuccess, dispatch]);

  console.log("playersData -", playersData?.data?.player);
  console.log("redux -", players);
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <Toolbar /> {/* Add spacing below fixed header */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Toolbar /> {/* Additional spacing for mobile search bar */}
      </Box>
      
      <Container 
        component="main" 
        maxWidth="lg"
        sx={{ 
          flex: 1,
          py: 4
        }}
      >
        <Outlet />
      </Container>
      
      <Footer />
    </Box>
  )
}