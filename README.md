# Skycast Weather App

A gorgeous, fast, high-performance, and fully responsive glassmorphic weather application built with React, Vite, and Tailwind CSS.

This application is 100% standalone, local-first, and contains **no dependencies on Gemini, OpenAI, or any other AI services**.

## Features

- **Automatic Location Detection**: Instantly requests browser location permission on startup to display real-time weather and air quality for your exact coordinates.
- **Keyless and Standalone**: Powered by public, high-fidelity REST APIs (Open-Meteo and OpenStreetMap Nominatim). Run the app anywhere with **zero API keys required**.
- **Comprehensive Weather Insights**:
  - Live temperature, apparent temperature ("Feels Like"), humidity, pressure, wind speeds, visibility, UV Index, and Cloud Cover.
  - Interactive Air Quality Index (AQI) with pollutant breakdown (PM2.5, PM10, CO, NO₂, SO₂, O₃) and health recommendations.
  - Interactive Hourly forecast (next 24 hours) with dynamic visual chart/bar indicators.
  - Detailed 7-day daily forecast with maximum/minimum temperatures, sunrise, sunset, and rain probabilities.
- **Offline Resilience**: Automatically caches successful weather reports, user favorites, recent search history, and settings in browser `localStorage`.
- **Advanced Preferences Panel**:
  - Toggle Temperature Unit (Celsius vs. Fahrenheit).
  - Enable/Disable Automatic Location Detection on startup.
  - Toggle Dark Theme vs. Light Theme.
  - Clear search history.
- **Visuals and Animations**: Designed using modern glassmorphic elements, seamless animations powered by `motion`, and rich indicators.

## API Services Used

This standalone weather app connects directly to the following high-availability public services:
1. **[Open-Meteo Forecast API](https://open-meteo.com/)**: Fetches real-time conditions, hourly trends, and 7-day daily forecasts.
2. **[Open-Meteo Air Quality API](https://open-meteo.com/)**: Retrieves current AQI and pollutant volumes.
3. **[Nominatim OpenStreetMap Geocoding](https://nominatim.openstreetmap.org/)**: Translates GPS coordinates into accurate human-readable city, state, and country tags.

## Installation & Setup

Follow these steps to run the application locally on your machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- npm (Node Package Manager)

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   This generates fully optimized static files in the `/dist` directory.

## Environment Configuration

Because the application utilizes public, keyless, and rate-limit-friendly APIs, **no `.env` setup or API keys are needed to run the app**. It is ready for production out-of-the-box.
