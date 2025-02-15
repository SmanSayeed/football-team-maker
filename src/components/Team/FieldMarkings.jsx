// src/components/Team/FieldMarkings.jsx
import { Box } from '@mui/material';

const FieldMarkings = () => {
  return (
    <>
      {/* Goal Area */}
      <Box sx={{
        position: 'absolute',
        bottom: '2%', // Moved up slightly
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40%',
        height: '25%', // Increased height
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '5px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%'
        }
      }} />

      {/* Center Circle */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: '15%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%'
      }} />

      {/* Halfway Line */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        width: '100%',
        height: '2px',
        bgcolor: 'rgba(255, 255, 255, 0.3)'
      }} />
    </>
  );
};

export default FieldMarkings;