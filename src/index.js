import "./style.css";
import { getWeatherByLocation } from "./api/weather";

const LOCATION_INPUT = document.querySelector(".location-input");
const FETCH_WEATHER_BUTTON = document.querySelector("#fetchWeatherButton");
const WEATHER_DISPLAY = document.querySelector(".weather-display");
const ERROR_MESSAGE = document.querySelector(".error-message");
const TOGGLE_UNIT_BUTTON = document.querySelector(".toggle-unit");
let isCelsius = false;
let lastWeatherData = null;

function displayError(message) {
  ERROR_MESSAGE.textContent = message;
  WEATHER_DISPLAY.innerHTML = "";
}

FETCH_WEATHER_BUTTON.addEventListener("click", () => {
  const location = LOCATION_INPUT.value.trim();
  if (!location) {
    displayError("Please enter a valid location.");
    return;
  }
  getWeatherByLocation(location, renderWeather, handleApiError);
});

function handleApiError(error) {
  displayError("Failed to fetch weather data. Please try again.");
  console.error("API error:", error);
}

function renderWeather(data) {
  if (!data || !data.current || !data.location) {
    displayError("Invalid data received from the weather API.");
    return;
  }

  lastWeatherData = data;
  const temperature = isCelsius ? data.current.temp_c : data.current.temp_f;
  const tempUnit = isCelsius ? "C" : "F";
  WEATHER_DISPLAY.innerHTML = `
    <h1>${data.location.name}, ${data.location.region}</h1>
    <p>Temperature: ${temperature}°${tempUnit}</p>
  `;
  ERROR_MESSAGE.textContent = "";
  applyWeatherBasedUI(data.current.condition.code);
}

function applyWeatherBasedUI(conditionCode) {
  // Object mapping weather condition codes to UI styles
  const conditionStyles = {
    1000: {
      backgroundColor: "#f7dc6f",
      shadowColor: "#e6c65b",
      textColor: "#212f3d",
    }, // Clear
    1003: {
      backgroundColor: "#85c1e9",
      shadowColor: "#75b1d9",
      textColor: "#283747",
    }, // Partly cloudy
    1006: {
      backgroundColor: "#aeb6bf",
      shadowColor: "#9ea5ad",
      textColor: "#1b2631",
    }, // Cloudy
    1009: {
      backgroundColor: "#5d6d7e",
      shadowColor: "#4d5e6f",
      textColor: "#f4f6f7",
    }, // Overcast
    1030: {
      backgroundColor: "#d5d5d5",
      shadowColor: "#c5c5c5",
      textColor: "#333333",
    }, // Mist
    1063: {
      backgroundColor: "#a1c4fd",
      shadowColor: "#91b4ed",
      textColor: "#ffffff",
    }, // Patchy rain possible
    // ... map all other conditions ...
  };

  // Default style if condition code isn't in the object
  const defaultStyle = {
    backgroundColor: "#e0e5ec",
    shadowColor: "#a3b1c6",
    textColor: "#000",
  };
  const style = conditionStyles[conditionCode] || defaultStyle;

  // Apply styles based on the condition
  const body = document.body;
  const weatherDisplay = document.querySelector(".weather-display");

  // Change the body background and text color
  body.style.backgroundColor = style.backgroundColor;
  body.style.color = style.textColor;

  // Change the weather display background, shadow and text color
  weatherDisplay.style.backgroundColor = style.backgroundColor;
  weatherDisplay.style.boxShadow = `inset 4px 4px 6px ${style.shadowColor}, inset -4px -4px 6px #fff`;
  weatherDisplay.style.color = style.textColor;
}

TOGGLE_UNIT_BUTTON.addEventListener("click", () => {
  isCelsius = !isCelsius;
  if (lastWeatherData) {
    renderWeather(lastWeatherData);
  }
});
