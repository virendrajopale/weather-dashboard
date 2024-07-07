import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Box,  } from '@mui/material';
import './App.css';
import Forecast from './Components/Forecast';
import SearchBox from './Components/SearchBox';
import TemperatureChart from './Components/Chart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  const apiKey=process.env.REACT_APP_API_KEY;
  const [weatherData, setWeatherData] = useState({
    temp: "",
    humidity: "",
    windSpeed: "",
    condition: "",
    icon: "",
    city: "",
    county: "",
    date: '',
    feels_like:""
  });
  const [city, setCity] = useState("Mumbai");
  const [forecast, setForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const getData = async () => {
    const toastId = toast.loading("Fetching weather data...");
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      let res = await axios.get(url);
      let data = res.data;
      setWeatherData({
        temp: ((data.main.temp) - 273).toFixed(2),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        city: data.name,
        county: data.sys.country,
        date: new Date(data.dt * 1000).toLocaleDateString()
      });
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      await getDataFor7Days(lat, lon);
      toast.update(toastId, { render: `Weather data for ${data.name} loaded successfully!`, type: "success", isLoading: false, autoClose: 5000 });

    } catch (error) {
      console.log(error);
      const toastId = toast.loading("Fetching weather data...");    }
  };

  const getDataFor7Days = async (lat, lon) => {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
      let res = await axios.get(url);
      let data = res.data;
  
      const daily = data.list.filter(d => d.dt_txt.slice(-8) === "00:00:00")
        .map(day => {
          return {
            temp: (day.main.temp - 273).toFixed(2),
            condition: day.weather[0].description,
            feels: ((day.main.feels_like) - 273).toFixed(2),
            icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
            humidity: day.main.humidity,
            windSpeed: day.wind.speed,
            date:(day.dt_txt.slice(0,10))
          };
        });
      setForecast(daily);
      toast.info('5-day forecast loaded successfully!');
    } catch (error) {
      console.log(error);
      toast.error(`Failed to load 5-day forecast. ${error.response?.data?.message || error.message}`);
    }
  };

  const getSuggestions = async (input) => {
    try {
      let url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=10&appid=${apiKey}`;
      let res = await axios.get(url);
      setSuggestions(res.data.map(item => item.name));
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedGetSuggestions = useCallback(
    debounce((input) => getSuggestions(input), 300),
    []
  );

  const handleChange = (e) => {
    const input = e.target.value;
    setCity(input);
    if (input.length > 2) {
      debouncedGetSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    getData();
  };

  const handleSearch = () => {
    getData();
    setSuggestions([]);
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  useEffect(() => {
    getData();
  }, []);

  const backgroundStyle = (condition) => {
    switch (condition) {
      case 'clear sky':
        return 'linear-gradient(to right, #00c6ff, #0072ff)';
      case 'few clouds':
        return 'linear-gradient(to right, #fbc2eb, #a6c1ee)';
      case 'scattered clouds':
        return 'linear-gradient(to right, #d7d2cc, #304352)';
      case 'broken clouds':
        return 'linear-gradient(to right, #73c8a9, #373b44)';
      case 'shower rain':
        return 'linear-gradient(to right, #83a4d4, #b6fbff)';
      case 'rain':
        return 'linear-gradient(to right, #005c97, #363795)';
      case 'thunderstorm':
        return 'linear-gradient(to right, #20002c, #cbb4d4)';
      case 'snow':
        return 'linear-gradient(to right, #83a4d4, #b6fbff)';
      case 'mist':
        return 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      default:
        return 'linear-gradient(to right, #00c6ff, #0072ff)';
    }
  };
  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: backgroundStyle(weatherData.condition),
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <SearchBox 
            city={city}
            weatherData={weatherData}
            handleChange={handleChange}
            handleSearch={handleSearch}
            handleSuggestionClick={handleSuggestionClick}
            suggestions={suggestions}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>7-Day Forecast</Typography>
              <Forecast forecast={forecast} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
            <CardContent>
              <TemperatureChart forecast={forecast} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
      
    <ToastContainer />
  </Box>
  );
}

export default App;
