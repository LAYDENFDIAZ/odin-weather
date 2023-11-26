// weather.js

const API_KEY = env.API_KEY; // API key for the WeatherAPI
const BASE_URL = "http://api.weatherapi.com/v1"; // Base URL for the WeatherAPI

// Fetches weather data for a specific location
export async function getWeatherByLocation(location, callback, errorCallback) {
  // Execute code that might throw error(try)
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${location}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      errorCallback(`Location error: ${data.error.message}`);
    } else {
      callback(data);
    }
  } catch (error) {
    errorCallback("Network error occurred.");
  }
}

// Fetches weather forecast for a specific ZIP code
export async function getWeatherByZip(user_zip, callback, errorCallback) {
  try {
    displayLoading(true); // Show loading indicator

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${user_zip}&days=7`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const JSON_RESPONSE = await response.json();
    if (JSON_RESPONSE.error) {
      errorCallback(`Location error: ${JSON_RESPONSE.error.message}`);
    } else {
      callback(JSON_RESPONSE);
    }

    displayLoading(false); // Hide loading indicator
  } catch (error) {
    errorCallback("Network error occurred.");
    displayLoading(false);
  }
}

// Displays weather data on the webpage
function displayWeather(JSON_RESPONSE) {
  const weatherInfoDiv = document.getElementById("weatherInfo");
  const { current, location } = JSON_RESPONSE;

  weatherInfoDiv.innerHTML = `
    <h2>Weather in ${location.name}</h2>
    <p>Temperature: ${current.temp_c}°C</p>
    <p>Condition: ${current.condition.text}</p>
    <img src="${current.condition.icon}" alt="Weather Icon">
  `;
}

// Shows or hides the loading indicator
function displayLoading(isLoading) {
  const loadingDiv = document.getElementById("loading");
  loadingDiv.style.display = isLoading ? "block" : "none";
}
