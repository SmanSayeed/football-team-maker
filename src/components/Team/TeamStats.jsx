// src/components/Team/TeamStats.jsx
import { Grid, Card, CardContent, Typography } from '@mui/material';

const TeamStats = ({ formation, totalBudget }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Formation
            </Typography>
            <Typography variant="h5">
              {formation || 'Not Selected'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Budget
            </Typography>
            <Typography variant="h5">
              {totalBudget.toFixed(1)}M €
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeamStats;