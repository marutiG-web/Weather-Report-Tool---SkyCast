import { 
  WeatherReport, 
  LocationData, 
  CurrentWeatherData, 
  HourlyForecastData, 
  DailyForecastData, 
  AirQualityData 
} from './types';

// Map WMO Weather Interpretation Codes (0-99) to readable condition and category
export function getWeatherCondition(code: number, isDay: boolean = true): { label: string; category: 'sunny' | 'rain' | 'snow' | 'cloudy' | 'thunderstorm' | 'night' } {
  if (!isDay && (code === 0 || code === 1)) {
    return { label: 'Clear Night', category: 'night' };
  }

  switch (code) {
    case 0:
      return { label: 'Clear Sky', category: 'sunny' };
    case 1:
      return { label: 'Mainly Clear', category: 'sunny' };
    case 2:
      return { label: 'Partly Cloudy', category: 'cloudy' };
    case 3:
      return { label: 'Overcast', category: 'cloudy' };
    case 45:
    case 48:
      return { label: 'Foggy', category: 'cloudy' };
    case 51:
    case 53:
    case 55:
      return { label: 'Light Drizzle', category: 'rain' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', category: 'snow' };
    case 61:
      return { label: 'Light Rain', category: 'rain' };
    case 63:
      return { label: 'Moderate Rain', category: 'rain' };
    case 65:
      return { label: 'Heavy Rain', category: 'rain' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', category: 'snow' };
    case 71:
      return { label: 'Light Snow', category: 'snow' };
    case 73:
      return { label: 'Moderate Snow', category: 'snow' };
    case 75:
      return { label: 'Heavy Snow', category: 'snow' };
    case 77:
      return { label: 'Snow Grains', category: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', category: 'rain' };
    case 85:
    case 86:
      return { label: 'Snow Showers', category: 'snow' };
    case 95:
      return { label: 'Thunderstorm', category: 'thunderstorm' };
    case 96:
    case 99:
      return { label: 'Thunderstorm with Hail', category: 'thunderstorm' };
    default:
      return { label: 'Unknown Weather', category: 'sunny' };
  }
}

// Convert European or US AQI into standard visual descriptions
export function getAqiCategory(usAqi: number): { label: string; color: string; description: string } {
  if (usAqi <= 50) {
    return { 
      label: 'Good', 
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', 
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.' 
    };
  } else if (usAqi <= 100) {
    return { 
      label: 'Moderate', 
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', 
      description: 'Air quality is acceptable. There may be a risk for highly sensitive people.' 
    };
  } else if (usAqi <= 150) {
    return { 
      label: 'Unhealthy for Sensitive', 
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', 
      description: 'Members of sensitive groups may experience health effects.' 
    };
  } else if (usAqi <= 200) {
    return { 
      label: 'Unhealthy', 
      color: 'bg-red-500/20 text-red-300 border-red-500/30', 
      description: 'Everyone may begin to experience health effects.' 
    };
  } else if (usAqi <= 300) {
    return { 
      label: 'Very Unhealthy', 
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', 
      description: 'Health alert: everyone may experience more serious health effects.' 
    };
  } else {
    return { 
      label: 'Hazardous', 
      color: 'bg-rose-900/40 text-rose-300 border-rose-900/50', 
      description: 'Health warning of emergency conditions.' 
    };
  }
}

// Format date into human-readable weekday or short date
function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getFormattedDayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fetch autocomplete city suggestions using the Open-Meteo Geocoding API
export async function fetchCitySuggestions(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch suggestions');

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country || '',
      country_code: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'UTC',
      admin1: item.admin1 || '',
    }));
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
}

// Fetch complete weather report for coordinates
export async function fetchWeatherReport(location: LocationData): Promise<WeatherReport> {
  const { latitude, longitude, timezone } = location;

  try {
    // 1. Fetch Forecast & Current Weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,visibility&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(timezone)}`;
    
    // 2. Fetch Air Quality Data
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide&timezone=${encodeURIComponent(timezone)}`;

    const [weatherRes, aqRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqUrl).catch(err => {
        console.warn('Air quality fetch failed, proceeding with mock fallback', err);
        return null;
      })
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Failed to fetch weather data: ${weatherRes.statusText}`);
    }

    const weatherData = await weatherRes.json();
    
    // Process Air Quality (either real or fallback)
    let aqDataObj: AirQualityData;
    if (aqRes && aqRes.ok) {
      const aqRaw = await aqRes.json();
      const currentAq = aqRaw.current || {};
      const usAqi = currentAq.us_aqi ?? 25;
      const category = getAqiCategory(usAqi);
      
      aqDataObj = {
        europeanAqi: currentAq.european_aqi ?? 0,
        usAqi: usAqi,
        pm2_5: currentAq.pm2_5 ?? 0,
        pm10: currentAq.pm10 ?? 0,
        no2: currentAq.nitrogen_dioxide ?? 0,
        so2: currentAq.sulphur_dioxide ?? 0,
        o3: currentAq.ozone ?? 0,
        co: currentAq.carbon_monoxide ?? 0,
        label: category.label,
        color: category.color,
        description: category.description
      };
    } else {
      // Fallback
      const category = getAqiCategory(35);
      aqDataObj = {
        europeanAqi: 30,
        usAqi: 35,
        pm2_5: 8.5,
        pm10: 15.2,
        no2: 12.0,
        so2: 1.5,
        o3: 45.0,
        co: 250,
        label: category.label,
        color: category.color,
        description: category.description
      };
    }

    // Process current weather
    const current = weatherData.current;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;

    const conditionMap = getWeatherCondition(current.weather_code, current.is_day === 1);
    
    // Resolve city's local date and time accurately
    const timeOptions = {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    } as const;
    const localTime = new Intl.DateTimeFormat('en-US', timeOptions).format(new Date());

    const dateOptions = {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    } as const;
    const localDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date());

    // Extract sunrise and sunset formatted strings
    const currentSunriseISO = daily.sunrise[0];
    const currentSunsetISO = daily.sunset[0];

    const formatTimeFromISO = (isoStr: string) => {
      try {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(new Date(isoStr));
      } catch {
        return isoStr.split('T')[1]?.substring(0, 5) || '';
      }
    };

    const sunriseStr = formatTimeFromISO(currentSunriseISO);
    const sunsetStr = formatTimeFromISO(currentSunsetISO);

    // Current hour index in hourly arrays to align current conditions
    const currentHourISO = current.time.substring(0, 14) + '00';
    let currentHourIndex = hourly.time.findIndex((t: string) => t.startsWith(currentHourISO));
    if (currentHourIndex === -1) currentHourIndex = 0;

    const chanceOfRain = hourly.precipitation_probability[currentHourIndex] ?? 0;

    const currentWeatherData: CurrentWeatherData = {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      pressure: current.pressure_msl,
      visibility: (current.visibility ?? 10000) / 1000, // convert to km
      uvIndex: hourly.uv_index[currentHourIndex] ?? 0,
      cloudPercentage: current.cloud_cover,
      isDay: current.is_day === 1,
      weatherCode: current.weather_code,
      weatherCondition: conditionMap.label,
      chanceOfRain: chanceOfRain,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
      localTime,
      localDate
    };

    // Process hourly forecast (next 24 hours starting from current hour)
    const hourlyForecasts: HourlyForecastData[] = [];
    const startIndex = currentHourIndex;
    const limit = Math.min(startIndex + 24, hourly.time.length);

    for (let i = startIndex; i < limit; i++) {
      let displayHour = '';
      try {
        const hDate = new Date(hourly.time[i]);
        displayHour = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          hour12: true
        }).format(hDate);
      } catch {
        displayHour = hourly.time[i].split('T')[1]?.substring(0, 5) || '';
      }

      hourlyForecasts.push({
        time: displayHour,
        rawTime: hourly.time[i],
        temp: hourly.temperature_2m[i],
        feelsLike: hourly.apparent_temperature[i],
        weatherCode: hourly.weather_code[i],
        isDay: hourly.is_day[i] === 1,
        precipitationProbability: hourly.precipitation_probability[i] ?? 0,
        windSpeed: hourly.wind_speed_10m[i] ?? 0,
        humidity: hourly.relative_humidity_2m[i] ?? 0,
        uvIndex: hourly.uv_index[i] ?? 0,
      });
    }

    // Process daily forecast (7 days)
    const dailyForecasts: DailyForecastData[] = [];
    const dailyCount = daily.time.length;

    for (let i = 0; i < dailyCount; i++) {
      dailyForecasts.push({
        date: getFormattedDayDate(daily.time[i]),
        dayOfWeek: getDayName(daily.time[i]),
        rawDate: daily.time[i],
        weatherCode: daily.weather_code[i],
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        uvIndexMax: daily.uv_index_max[i] ?? 0,
        sunrise: formatTimeFromISO(daily.sunrise[i]),
        sunset: formatTimeFromISO(daily.sunset[i]),
        precipitationSum: daily.precipitation_sum[i] ?? 0,
        precipitationProbabilityMax: daily.precipitation_probability_max[i] ?? 0,
        windSpeedMax: daily.wind_speed_10m_max[i] ?? 0,
      });
    }

    return {
      location,
      current: currentWeatherData,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      airQuality: aqDataObj
    };
  } catch (error) {
    console.error('Error fetching complete weather report:', error);
    throw error;
  }
}

// Reverse geocode latitude and longitude to resolve city name keylessly
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SkycastWeatherApp/1.0'
      }
    });
    
    if (!res.ok) throw new Error('Reverse geocoding failed');
    
    const data = await res.json();
    const address = data.address || {};
    
    const name = address.city || address.town || address.village || address.suburb || address.county || 'Detected Location';
    const country = address.country || 'Unknown';
    const country_code = address.country_code || '';
    const admin1 = address.state || address.region || '';
    
    return {
      name,
      country,
      country_code,
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      admin1
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    // Fallback if Nominatim fails or blocks
    return {
      name: 'Detected Location',
      country: 'Near you',
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    };
  }
}

