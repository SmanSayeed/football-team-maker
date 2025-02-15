
import { Box, Typography, Divider } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export default function HomeTitle() {
  return (
    <>
        <Box 
        sx={{ 
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 2
          }}
        >
          <SportsSoccerIcon 
            sx={{ 
              fontSize: '2.5rem',
              color: 'primary.main',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2, #82b1ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Football Team Maker
          </Typography>
        </Box>

        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            mb: 3,
            maxWidth: '600px',
            lineHeight: 1.6
          }}
        >
          Build your dream team by exploring and selecting players from our comprehensive database
        </Typography>

        <Divider 
          sx={{ 
            width: '100%',
            maxWidth: '800px',
            mb: 3,
            '&::before, &::after': {
              borderColor: 'primary.light',
            }
          }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              px: 2,
              fontStyle: 'italic'
            }}
          >
            Click on a player to view details
          </Typography>
        </Divider>
      </Box>
    </>
  )
}
