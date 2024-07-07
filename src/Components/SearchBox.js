import React from 'react'
import { Card, CardContent, Typography, TextField, Grid, Box, List, ListItem, ListItemText } from '@mui/material';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';

const SearchBox = ({city, weatherData, handleChange, handleSuggestionClick, suggestions}) => {
  return (
    <Card elevation={3} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Weather Search</Typography>
        <Box position="relative" mb={2}>
          <TextField 
            fullWidth
            variant="outlined"
            label="Enter City"
            value={city}
            onChange={handleChange}
          />
          {suggestions.length > 0 && (
            <Box position="absolute" width="100%" zIndex={1} bgcolor="rgba(255,255,255,0.9)" borderRadius="0 0 4px 4px">
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Box>   
          )}
        </Box>
              
        {weatherData.city && (
          <Card sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">{weatherData.city}, {weatherData.county}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">{weatherData.date}</Typography>
                </Grid>
              </Grid>
        
              <Grid container spacing={2} alignItems="center" mt={1}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" justifyContent="center">
                    <img
                      src={weatherData.icon}
                      alt={weatherData.condition}
                      style={{ width: '100%', maxWidth: 150, height: 'auto' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h3">{weatherData.temp}°C</Typography>
                  <Typography variant="h6">{weatherData.condition}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <WiThermometer size={24} />
                    <Typography variant="body1" ml={1}>Feels like: {weatherData.feels_like}°C</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <WiHumidity size={24} />
                    <Typography variant="body1" ml={1}>Humidity: {weatherData.humidity}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <WiStrongWind size={24} />
                    <Typography variant="body1" ml={1}>Wind: {weatherData.windSpeed} m/s</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default SearchBox