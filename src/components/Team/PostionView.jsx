// src/components/Team/PositionView.jsx
import { Box, Typography } from '@mui/material';
import FieldView from './FieldView';

const PositionView = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Team Formation
      </Typography>
      <FieldView />
    </Box>
  );
};

export default PositionView;