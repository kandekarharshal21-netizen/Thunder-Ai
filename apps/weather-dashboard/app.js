// Map WMO Weather codes to FontAwesome icons and descriptions
const weatherCodes = {
    0: { desc: 'Clear sky', icon: 'fa-sun' },
    1: { desc: 'Mainly clear', icon: 'fa-sun' },
    2: { desc: 'Partly cloudy', icon: 'fa-cloud-sun' },
    3: { desc: 'Overcast', icon: 'fa-cloud' },
    45: { desc: 'Fog', icon: 'fa-smog' },
    48: { desc: 'Depositing rime fog', icon: 'fa-smog' },
    51: { desc: 'Light drizzle', icon: 'fa-cloud-rain' },
    53: { desc: 'Moderate drizzle', icon: 'fa-cloud-rain' },
    55: { desc: 'Dense drizzle', icon: 'fa-cloud-rain' },
    61: { desc: 'Slight rain', icon: 'fa-cloud-showers-heavy' },
    63: { desc: 'Moderate rain', icon: 'fa-cloud-showers-heavy' },
    65: { desc: 'Heavy rain', icon: 'fa-cloud-showers-heavy' },
    71: { desc: 'Slight snow', icon: 'fa-snowflake' },
    73: { desc: 'Moderate snow', icon: 'fa-snowflake' },
    75: { desc: 'Heavy snow', icon: 'fa-snowflake' },
    77: { desc: 'Snow grains', icon: 'fa-snowflake' },
    80: { desc: 'Slight rain showers', icon: 'fa-cloud-rain' },
    81: { desc: 'Moderate rain showers', icon: 'fa-cloud-rain' },
    82: { desc: 'Violent rain showers', icon: 'fa-cloud-showers-heavy' },
    95: { desc: 'Thunderstorm', icon: 'fa-bolt' },
    96: { desc: 'Thunderstorm with slight hail', icon: 'fa-poo-storm' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'fa-poo-storm' }
};

// Default location (London)
let currentLat = 51.5074;
let currentLon = -0.1278;
let currentCityName = 'London, UK';

// DOM Elements
const citySearchInput = document.getElementById('city-search');
const searchResults = document.getElementById('search-results');
const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const tempValueEl = document.getElementById('temp-value');
const weatherDescEl = document.getElementById('weather-description');
const mainWeatherIcon = document.getElementById('main-weather-icon');
const windSpeedEl = document.getElementById('wind-speed');
const humidityEl = document.getElementById('humidity');
const uvIndexEl = document.getElementById('uv-index');
const precipitationEl = document.getElementById('precipitation');
const forecastListEl = document.getElementById('forecast-list');

// Initialize App
function init() {
    updateDate();
    fetchWeatherData(currentLat, currentLon, currentCityName);
    setupSearch();
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Fetch Weather Data from Open-Meteo
async function fetchWeatherData(lat, lon, cityName) {
    try {
        cityNameEl.textContent = cityName;
        // Reset state
        tempValueEl.textContent = '--';
        mainWeatherIcon.className = 'fas fa-spinner fa-spin';
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=auto`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        updateCurrentWeather(data.current);
        updateHighlights(data.current, data.daily);
        updateForecast(data.daily);
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        cityNameEl.textContent = "Error fetching data";
    }
}

function updateCurrentWeather(current) {
    const code = current.weather_code;
    const weatherInfo = weatherCodes[code] || { desc: 'Unknown', icon: 'fa-cloud' };
    
    tempValueEl.textContent = Math.round(current.temperature_2m);
    weatherDescEl.textContent = weatherInfo.desc;
    
    // Change icon based on day/night if clear
    let iconClass = weatherInfo.icon;
    if (code === 0 || code === 1) {
        iconClass = current.is_day ? 'fa-sun' : 'fa-moon';
    }
    
    mainWeatherIcon.className = `fas ${iconClass}`;
}

function updateHighlights(current, daily) {
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;
    humidityEl.textContent = `${current.relative_humidity_2m} %`;
    precipitationEl.textContent = `${current.precipitation} mm`;
    
    // Max UV index for today
    uvIndexEl.textContent = daily.uv_index_max[0] ? daily.uv_index_max[0] : '--';
}

function updateForecast(daily) {
    forecastListEl.innerHTML = '';
    
    // Loop starting from tomorrow (index 1) for 7 days
    for (let i = 1; i <= 7; i++) {
        if (!daily.time[i]) break;
        
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const code = daily.weather_code[i];
        const weatherInfo = weatherCodes[code] || { desc: 'Unknown', icon: 'fa-cloud' };
        
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="icon-condition">
                <i class="fas ${weatherInfo.icon}"></i>
                <span>${weatherInfo.desc.split(' ')[0]}</span>
            </div>
            <div class="temps">
                <span class="max-temp">${maxTemp}°</span>
                <span class="min-temp">${minTemp}°</span>
            </div>
        `;
        
        forecastListEl.appendChild(forecastItem);
    }
}

// Search Functionality using Open-Meteo Geocoding
function setupSearch() {
    let debounceTimer;
    
    citySearchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }
        
        debounceTimer = setTimeout(() => {
            searchCity(query);
        }, 500);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!citySearchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
}

async function searchCity(query) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        
        searchResults.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(city => {
                const li = document.createElement('li');
                const adminName = city.admin1 ? `, ${city.admin1}` : '';
                const locationName = `${city.name}${adminName}, ${city.country}`;
                li.textContent = locationName;
                
                li.addEventListener('click', () => {
                    citySearchInput.value = '';
                    searchResults.classList.add('hidden');
                    fetchWeatherData(city.latitude, city.longitude, locationName);
                });
                
                searchResults.appendChild(li);
            });
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = '<li>No results found</li>';
            searchResults.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Geocoding error:", error);
    }
}

// Run init
init();
