// src/pages/Home.jsx
import React from 'react';
import { Box } from '@mui/material';
import PlayerGrid from '../../components/PlayerGrid/PlayerGrid';
import HomeTitle from './HomeTitle';
import { useCountries } from '../../hooks/useCountries';
import { useClubs } from '../../hooks/useClubs';

const Home = () => {
 
  return (
    <Box sx={{ p: 3 }}>
      <HomeTitle/>

      <PlayerGrid />
    </Box>
  );
};

export default Home;