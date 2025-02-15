
// src/components/Header/Header.jsx
import { AppBar, Box, Button, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Logo from '../../submodule/ui/Logo/Logo';
import AddIcon from '@mui/icons-material/Add';
import SearchPlayer from '../SearchPlayer/SearchPlayer';
import { Link } from 'react-router';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white', 
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: '100%',
            gap: { xs: 1, md: 3 }
          }}
        >
          <Logo />
          
          {!isMobile && (
            <Box sx={{ flex: 1, maxWidth: 300 }}>
              <SearchPlayer />
            </Box>
          )}
          
          <Box sx={{ ml: 'auto' }}>
            <Link 
              to="/create-team" 
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  px: 2,
                }}
              >
                Create Team
              </Button>
            </Link>
          </Box>
        </Box>
      </Toolbar>

      {isMobile && (
        <Box 
          sx={{ 
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'white'
          }}
        >
          <SearchPlayer />
        </Box>
      )}
    </AppBar>
  );
};

export default Header;