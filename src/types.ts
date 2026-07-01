export interface LocationData {
  name: string;
  country: string;
  country_code?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
  isCurrentLocation?: boolean;
}

export interface CurrentWeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudPercentage: number;
  isDay: boolean;
  weatherCode: number;
  weatherCondition: string;
  chanceOfRain: number;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
  localTime: string;
  localDate: string;
}

export interface HourlyForecastData {
  time: string;
  rawTime: string;
  temp: number;
  feelsLike: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
}

export interface DailyForecastData {
  date: string;
  dayOfWeek: string;
  rawDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface AirQualityData {
  europeanAqi: number;
  usAqi: number;
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  label: string;
  color: string;
  description: string;
}

export interface WeatherReport {
  location: LocationData;
  current: CurrentWeatherData;
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
  airQuality: AirQualityData;
}

export type TempUnit = 'C' | 'F';

export interface SavedCity extends LocationData {
  id: string;
}
