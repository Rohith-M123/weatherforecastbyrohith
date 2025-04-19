const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherCards = document.querySelector(".weather-cards");
/*replace it with your weather api */
const API_KEY = "/*replace it with your apikey*/";

const createCard = (item) => `
  <li class="card">
    <h3>${item.dt_txt.split(" ")[0]}</h3>
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon">
    <h4>Temp: ${(item.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${item.wind.speed} m/s</h4>
    <h4>Humidity: ${item.main.humidity}%</h4>
  </li>
`;

const fetchForecast = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const days = [];
      const filtered = data.list.filter(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days.includes(date)) {
          days.push(date);
          return true;
        }
        return false;
      });

      weatherCards.innerHTML = filtered.map(createCard).join('');
    });
};

const getCityForecast = () => {
  const city = cityInput.value.trim();
  if (!city) return;
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return alert("City not found!");
      const { lat, lon } = data[0];
      fetchForecast(lat, lon);
    });
};

const getLocationForecast = () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetchForecast(latitude, longitude);
  });
};

searchButton.addEventListener("click", getCityForecast);
locationButton.addEventListener("click", getLocationForecast);
