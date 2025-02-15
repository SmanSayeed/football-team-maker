// src/components/PlayerFilters/PlayerFilters.jsx
import { Box, Button } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import SelectFilter from '../../submodule/ui/SelectFilter/SelectFilter';
import RangeFilter from '../../submodule/ui/RangeFilter/RangeFilter';
import { useCountries } from '../../hooks/useCountries';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useClubs } from '../../hooks/useClubs';

const PlayerFilters = ({ onFilter, onClear }) => {
  const { countries } = useCountries();
  const {clubs} = useClubs();
  const [filters, setFilters] = useState({
    country: '',
    club: '',
    minValue: '',
    maxValue: '',
    minAge: '',
    maxAge: '',
  });

  // Get unique clubs from players
// console.log("clubs ", clubs);
  const countryOptions =countries.length>0 && countries.map(country => ({
    value: country.id,
    label: country.name
  }));

  const clubOptions = clubs.map(club => ({
    value: club.id,
    label: club.name
  }));

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: parseInt(value) || value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      country: '',
      club: '',
      minValue: '',
      maxValue: '',
      minAge: '',
      maxAge: '',
    });
    onClear();
  }, [onClear]);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mb: 3,
      alignItems: 'flex-end'
    }}>
      <SelectFilter
        label="Country"
        value={filters.country}
        onChange={(e) => handleFilterChange('country', e.target.value)}
        options={countryOptions}
      />

      <SelectFilter
        label="Club"
        value={filters.club}
        onChange={(e) => handleFilterChange('club', e.target.value)}
        options={clubOptions}
      />

      <RangeFilter
        label="Market Value (M€)"
        minValue={filters.minValue}
        maxValue={filters.maxValue}
        onMinChange={(e) => handleFilterChange('minValue', e.target.value)}
        onMaxChange={(e) => handleFilterChange('maxValue', e.target.value)}
        type="number"
        inputProps={{ min: 0 }}
      />

      <RangeFilter
        label="Age"
        minValue={filters.minAge}
        maxValue={filters.maxAge}
        onMinChange={(e) => handleFilterChange('minAge', e.target.value)}
        onMaxChange={(e) => handleFilterChange('maxAge', e.target.value)}
        type="number"
        inputProps={{ min: 15, max: 45 }}
      />

      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => onFilter(filters)}
        sx={{ height: 40 }}
      >
        Apply Filters
      </Button>

      <Button
        variant="outlined"
        color="error"
        startIcon={<CloseIcon />}
        onClick={handleClearFilters}
        sx={{ height: 40 }}
      >
        Clear
      </Button>
    </Box>
  );
};

export default PlayerFilters;