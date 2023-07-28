// Import React hooks and libraries
import { useEffect, useState } from 'react';

// Import Material-UI components
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Define the City type
interface City {
  name: string;
}

// Define the props for the AutocompleteCityList component
interface AutocompleteProps {
  onChange: (event: React.ChangeEvent<{}>, value: string | null) => void;
  selectedCity: string | null;
}

// AutocompleteCityList component
const AutocompleteCityList: React.FC<AutocompleteProps> = ({ onChange, selectedCity }) => {
  const [cityList, setCityList] = useState<City[]>([]);

  useEffect(() => {
    // Fetch the list of cities when the component mounts
    const fetchCityList = async () => {
      try {
        // Fetch data from the API to get the list of cities
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        if (response.ok) {
          // Extract the city names from the data and set the cityList state
          const cities = data.map((country: any) => ({ name: country.name.common }));
          setCityList(cities);
        } else {
          console.error('Failed to fetch city list.');
        }
      } catch (error) {
        console.error('Error while fetching city list:', error);
      }
    };

    fetchCityList();
  }, []);

  return (
    // Autocomplete component to display the city list and handle city selection
    <Autocomplete
      options={cityList?.map((city) => city.name)}
      sx={{ width: 300 }}
      renderInput={(params) => (
        // TextField to render the input field for city selection
        <TextField
          {...params}
          label="City"
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {/* Display any existing endAdornment (if present) */}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      // Call the onChange handler when the user interacts with the Autocomplete
      onInputChange={onChange}
      value={selectedCity}
      // Call the onChange handler when a city is selected from the list
      onChange={(event, value) => {
        onChange(event, value);
      }}
    />
  );
};

export default AutocompleteCityList;
