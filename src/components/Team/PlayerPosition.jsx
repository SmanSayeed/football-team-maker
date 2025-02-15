// src/components/Team/PlayerPosition.jsx
import { Box, Avatar, Typography, IconButton, Tooltip, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PlayerPosition = ({ 
  player, 
  position, 
  category,
  onAddPlayer,
  onRemovePlayer,
  onPlayerClick
}) => {
  const isPlayerAssigned = player !== undefined && player !== null;

  const handleRemove = (event) => {
    event.stopPropagation();
    onRemovePlayer(player.id, category);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${position}%`,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      {isPlayerAssigned ? (
        <>
          <Box 
            sx={{ 
              position: 'relative',
              '&:hover .delete-icon': {
                opacity: 1
              }
            }}
          >
            <Avatar
              src={player.playerImage}
              alt={player.playerName}
              onClick={() => onPlayerClick(player)}
              sx={{
                width: 60,
                height: 60,
                border: '2px solid white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            />
            <IconButton
              className="delete-icon"
              size="small"
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: 'error.main',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  bgcolor: 'error.dark'
                },
                zIndex: 1
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              maxWidth: 100,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {player.playerName}
          </Typography>
        </>
      ) : (
        <Tooltip title={`Add ${category.slice(0, -1)}`}>
          <Button
            variant="contained"
            onClick={() => onAddPlayer(category)}
            sx={{
              minWidth: 'auto',
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default PlayerPosition;