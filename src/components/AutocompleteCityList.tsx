
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface City {
  name: string;
}

interface AutocompleteProps {
  onChange: (event: React.ChangeEvent<{}>, value: string | null) => void;
  selectedCity: string | null;
}

const AutocompleteCityList: React.FC<AutocompleteProps> = ({ onChange, selectedCity }) => {
  const [cityList, setCityList] = useState<City[]>([]);
  useEffect(() => {
    const fetchCityList = async () => {
      try {

        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        if (response.ok) {

          const cities = data.map((country:any) => ({ name: country.name.common }));
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
    <Autocomplete
      options={cityList?.map((city) => city.name)}
      sx={{ width: 300 }}
      renderInput={(params) => (
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
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onInputChange={onChange}
      value={selectedCity}
      onChange={(event, value) => {
        onChange(event, value);
      }}
    />
  );
};

export default AutocompleteCityList;
