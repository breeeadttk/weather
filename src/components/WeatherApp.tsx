
'use client'

import { useState } from 'react';
import AutocompleteComponent from './AutocompleteCityList';
import WeatherCity from './WeatherCity';
import Box from '@mui/material/Box';

const WeatherApp: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCityChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setSelectedCity(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5', // Set your desired background color
        rowGap: 5,
      }}
    >

      <AutocompleteComponent onChange={handleCityChange} selectedCity={selectedCity} />
      {selectedCity && <WeatherCity city={selectedCity} />}
    </Box>
  );
};

export default WeatherApp;
