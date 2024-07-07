import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiFog } from 'react-icons/wi';

const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'clear sky':
      return <WiDaySunny size={50} />;
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
      return <WiCloud size={50} />;
    case 'shower rain':
    case 'rain':
      return <WiRain size={50} />;
    case 'thunderstorm':
      return <WiRain size={50} />;
    case 'snow':
      return <WiSnow size={50} />;
    case 'mist':
      return <WiFog size={50} />;
    default:
      return <WiDaySunny size={50} />;
  }
};

function Forecast({ forecast }) {
console.log(forecast);
  return (
    <Grid container spacing={2}>
      {forecast.map((day, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <CardContent>
              <Typography variant="subtitle1">{day.date}</Typography>
              <CardMedia
                component="div"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50 }}
              >
                {getWeatherIcon(day.condition)}
              </CardMedia>
              <Typography variant="h6">{day.temp}°C</Typography>
              <Typography variant="body2">{day.condition}</Typography>
              <Typography variant="body2">Feels like: {day.feels}°C</Typography>
              <Typography variant="body2">Humidity: {day.humidity}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Forecast;
