import React, { useEffect, useState } from 'react';
import './Weather.css';
import searchIcon from '../images/search.png';
import clearIcon from '../images/clear.png';
import cloudsIcon from '../images/clouds.png';
import drizzleIcon from '../images/drizzle.png';
import humidityIcon from '../images/humidity.png';
import mistIcon from '../images/mist.png';
import rainIcon from '../images/rain.png';
import snowIcon from '../images/snow.png';
import windIcon from '../images/wind.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allIcons = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudsIcon,
    "02n": cloudsIcon,
    "03d": cloudsIcon,
    "03n": cloudsIcon,
    "04d": cloudsIcon,
    "04n": cloudsIcon,
    "09d": drizzleIcon,
    "09n": drizzleIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": drizzleIcon,
    "11n": drizzleIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": mistIcon,
    "50n": mistIcon
  };

  const getWeatherIcon = (iconId) => {
    return allIcons[iconId] || clearIcon;
  };

  const search = async (searchCity) => {
    if (!searchCity) return;
    setLoading(true);
    setError('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== 200) {
        setError(data.message || 'City not found');
        setWeatherData(null);
        setLoading(false);
        return;
      }
      const icon = getWeatherIcon(data.weather[0].icon);
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    search('');
  }, []);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearchClick = () => {
    search(city);
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={city}
          onChange={handleInputChange}
        />
        <img
          src={searchIcon}
          alt="search"
          onClick={handleSearchClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className='weather-data'>
            <div className="col">
              <img src={humidityIcon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windIcon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;