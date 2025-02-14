// src/components/Header/Header.jsx
import { AppBar, Box, Button, Toolbar } from '@mui/material';
import Logo from '../../submodule/ui/Logo/Logo';
import SearchInput from '../../submodule/ui/SeachInput/SearchInput';
import AddIcon from '@mui/icons-material/Add';
import SearchPlayer from '../SearchPlayer/SearchPlayer';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Logo />
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flex: { xs: 1, md: 'initial' },
          justifyContent: { xs: 'flex-end', md: 'initial' },
          ml: { xs: 2, md: 4 }
        }}>
         <SearchPlayer/>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '20px',
              whiteSpace: 'nowrap'
            }}
          >
            Create Team
          </Button>
        </Box>
      </Toolbar>
      
      {/* Mobile Search */}
      <Box sx={{ 
        display: { xs: 'block', md: 'none' },
        p: 2,
        backgroundColor: 'white'
      }}>
        <SearchInput fullWidth placeholder="Search players..." />
      </Box>
    </AppBar>
  );
};

export default Header;