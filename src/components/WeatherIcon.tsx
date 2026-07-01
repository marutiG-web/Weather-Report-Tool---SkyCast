import React from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudRain, 
  CloudDrizzle, 
  Snowflake, 
  CloudLightning,
  CloudFog,
  HelpCircle
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ code, isDay = true, className = '', size = 24 }: WeatherIconProps) {
  // Clear sky
  if (code === 0) {
    return isDay ? (
      <Sun 
        size={size} 
        className={`text-amber-400 animate-[spin_20s_linear_infinite] ${className}`} 
      />
    ) : (
      <Moon 
        size={size} 
        className={`text-indigo-200 animate-[pulse_3s_ease-in-out_infinite] ${className}`} 
      />
    );
  }

  // Mainly clear / partly cloudy
  if (code === 1 || code === 2) {
    return isDay ? (
      <CloudSun 
        size={size} 
        className={`text-sky-300 ${className}`} 
      />
    ) : (
      <CloudMoon 
        size={size} 
        className={`text-slate-300 ${className}`} 
      />
    );
  }

  // Overcast, fog
  if (code === 3 || code === 45 || code === 48) {
    return code === 3 ? (
      <Cloud 
        size={size} 
        className={`text-slate-400 ${className}`} 
      />
    ) : (
      <CloudFog 
        size={size} 
        className={`text-teal-200/80 ${className}`} 
      />
    );
  }

  // Drizzle
  if (code === 51 || code === 53 || code === 55) {
    return (
      <CloudDrizzle 
        size={size} 
        className={`text-sky-400 animate-[bounce_2s_ease-in-out_infinite] ${className}`} 
      />
    );
  }

  // Rain
  if (code === 61 || code === 63 || code === 65 || code === 80 || code === 81 || code === 82) {
    return (
      <CloudRain 
        size={size} 
        className={`text-blue-400 animate-[pulse_1.5s_ease-in-out_infinite] ${className}`} 
      />
    );
  }

  // Snow & Freezing Rain/Drizzle
  if (code === 56 || code === 57 || code === 66 || code === 67 || code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return (
      <Snowflake 
        size={size} 
        className={`text-blue-100 animate-[spin_15s_linear_infinite] ${className}`} 
      />
    );
  }

  // Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    return (
      <CloudLightning 
        size={size} 
        className={`text-yellow-400 ${className}`} 
      />
    );
  }

  return <HelpCircle size={size} className={`text-slate-400 ${className}`} />;
}
