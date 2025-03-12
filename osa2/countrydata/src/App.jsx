import React, { useState, useEffect } from 'react';

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  const capital = country.capital && country.capital[0];
  const capitalCoords = country.capitalInfo && country.capitalInfo.latlng;

  useEffect(() => {
    if (!capital) return;
    let weatherUrl = '';
    if (capitalCoords && capitalCoords.length === 2) {
      const [lat, lon] = capitalCoords;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`;
    }

    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error("Virhe haettaessa säätietoja:", error));
  }, [capital, capitalCoords, api_key]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <img 
        src={country.flags.png} 
        alt={`Lippu: ${country.name.common}`} 
        style={{ width: '150px', border: '1px solid #ccc' }} 
      />
      <p><strong>Virallinen nimi:</strong> {country.name.official}</p>
      <p><strong>Pääkaupunki:</strong> {country.capital && country.capital.join(', ')}</p>
      <p><strong>Väkiluku:</strong> {country.population}</p>
      <h3>Kielet:</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((lang, index) => (
            <li key={index}>{lang}</li>
          ))
        }
      </ul>

      {capital && weather && weather.weather && weather.weather[0] && weather.main && weather.wind && (
        <div style={{ marginTop: '20px' }}>
          <h3>Sää {capital}</h3>
          <p><strong>Lämpötila:</strong> {weather.main.temp} Celsius</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          <p><strong>Tuuli:</strong> {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const CountryList = ({ countries, onShowCountry }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common} 
          <button onClick={() => onShowCountry(country)}>
            Näytä
          </button>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error('Virhe haettaessa tietoja:', error));
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setSelectedCountry(null);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <label>Find countries: </label>
        <input value={filter} onChange={handleFilterChange} />
      </div>
      <div style={{ marginTop: '20px' }}>
        {filteredCountries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
          selectedCountry ? (
            <CountryDetail country={selectedCountry} />
          ) : (
            <CountryList 
              countries={filteredCountries} 
              onShowCountry={country => setSelectedCountry(country)} 
            />
          )
        )}

        {filteredCountries.length === 1 && (
          <CountryDetail country={filteredCountries[0]} />
        )}
      </div>
    </div>
  );
}

export default App