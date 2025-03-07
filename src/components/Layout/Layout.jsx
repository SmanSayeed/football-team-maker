// src/components/Layout/Layout.jsx
import { Box, Container, Toolbar } from '@mui/material'
import { Outlet } from 'react-router'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { usePlayers } from '../../hooks/usePlayers';
import { useCountries } from '../../hooks/useCountries';

export default function Layout() {
 
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <Toolbar />
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Toolbar />
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