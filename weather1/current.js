const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");

/*replace it with your weather api */
const API_KEY = "/*replace it with your apikey*/";

const showCurrentWeather = (city, data) => {
  currentWeatherDiv.innerHTML = `
    <h2>${city} (${data.weather[0].description})</h2>
    <h4>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${data.wind.speed} m/s</h4>
    <h4>Humidity: ${data.main.humidity}%</h4>
  `;
};

const fetchWeather = (lat, lon, cityName) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => showCurrentWeather(cityName, data))
    .catch(() => alert("Failed to fetch current weather."));
};

const getCoordinates = () => {
  const city = cityInput.value.trim();
  if (!city) return;
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return alert("City not found!");
      const { lat, lon, name } = data[0];
      fetchWeather(lat, lon, name);
    });
};

const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const { name } = data[0];
        fetchWeather(latitude, longitude, name);
      });
  });
};

searchButton.addEventListener("click", getCoordinates);
locationButton.addEventListener("click", getUserLocation);
