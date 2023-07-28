
import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import WavesIcon from '@mui/icons-material/Waves';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Replace with appropriate weather icons

interface WeatherData {
  location: {
    name: string;
    localtime: string;
  };

  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_kph: number;
    cloud: number;
  };
  forecast: {
    forecastday: {
      date: string;
      hour: {
        time: string;
        temp_c: number;
      }[];
    }[];
  };
}

interface WeatherCityProps {
  city: string;
}

const WeatherCity: React.FC<WeatherCityProps> = ({ city }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await axios.get<WeatherData>(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`
        );
        if (response.status === 200) {
          setWeatherData(response.data);
        } else {
          console.error('Failed to fetch weather data.');
        }
      } catch (error) {
        console.error('Error while fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const getTemperatureIcon = (temperature: number, size:string = 'large') => {
    switch (true) {

      case temperature > 20:
        return <WbSunnyIcon fontSize={size} />;
      case temperature > 10:
        return <BeachAccessIcon fontSize={size} />;
      default:
        return <AcUnitIcon fontSize={size} />;
    }
  };

  const { location, current, forecast } = weatherData;
  // const currentHour = forecast.forecastday[0].hour[0];

  const calculateGradientColor = (temperature: number) => {
    // Calculate the color based on the temperature range
    // You can define your custom temperature ranges and corresponding colors here
    if (temperature >= 30) {
      return '#FF1744'; // Red
    } else if (temperature >= 20) {
      return '#FFC107'; // Yellow
    } else {
      return '#2196F3'; // Blue
    }
  };
  return <Box
  sx={{
    padding: 2,
    borderRadius: 2,
    boxShadow: 3,
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: `linear-gradient(to bottom, ${calculateGradientColor(
      weatherData?.current.temp_c || 0
    )} 0%, #FFFFFF 100%)`,
  }}
>
  {weatherData && (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={7}>
        <Typography variant="h5">{weatherData.location.name}</Typography>
        <Typography variant="body1">
          {new Date().toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', my: 2 }}>
              {weatherData.forecast.forecastday[0].hour.slice(0, 3).map((hour) => (
                <Box>
                  <Typography variant="body2">
                    {new Date(hour.time_epoch * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  {getTemperatureIcon(hour.temp_c, 'small')}
                  <Typography variant="body2">{hour.temp_c}°C</Typography>
                </Box>
              ))}
          </Box>
          <Paper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding:1, borderRadius: 4, display:'flex', justifyContent:'space-between', columnGap:1 , alignItems:'center'}}>
    <Box sx={{ display: 'flex', alignItems: 'center', }}>
      <WbSunnyIcon sx={{ marginRight: 1 }} />
      <Typography variant="body2">{weatherData.current.wind_kph} km/h</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center',} }>
      <CloudIcon sx={{ marginRight: 1 }} />
      <Typography variant="body2">{weatherData.current.humidity}%</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' , }}>
      <WavesIcon sx={{ marginRight: 1 }} />
      <Typography variant="body2"> {weatherData.current.cloud}%</Typography>
    </Box>
  </Paper>
      </Grid>
      <Grid item xs={5} textAlign="center">
        {getTemperatureIcon(weatherData.current.temp_c)}
        <Typography variant="h4">
          {weatherData.current.temp_c}°C
        </Typography>
      </Grid>
    </Grid>
  )}
</Box>

};

export default WeatherCity;
