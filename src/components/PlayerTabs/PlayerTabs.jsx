
// src/components/PlayerTabs/PlayerTabs.jsx
import { Tabs, Tab } from '@mui/material';
import { TABS } from '../../constants/playerConstants';

const PlayerTabs = ({ selectedTab, onTabChange }) => (
  <Tabs 
    value={selectedTab} 
    onChange={onTabChange}
    aria-label="player category tabs"
    variant="scrollable"
    scrollButtons="auto"
    sx={{
      borderBottom: 1,
      borderColor: 'divider',
      flexGrow: 1,
      '& .MuiTab-root': {
        textTransform: 'none',
        minWidth: 120,
        fontWeight: 600
      }
    }}
  >
    {TABS.map((tab, index) => (
      <Tab 
        key={tab} 
        label={tab}
        id={`player-tab-${index}`}
        aria-controls={`player-tabpanel-${index}`}
      />
    ))}
  </Tabs>
);

export default PlayerTabs;