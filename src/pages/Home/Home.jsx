// src/pages/Home.jsx
import React from 'react';
import { Box } from '@mui/material';
import PlayerGrid from '../../components/PlayerGrid/PlayerGrid';
import HomeTitle from './HomeTitle';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <HomeTitle/>

      <PlayerGrid />
    </Box>
  );
};

export default Home;