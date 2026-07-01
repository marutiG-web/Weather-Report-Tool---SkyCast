import React from 'react';
import { 
  Wind, 
  Droplets, 
  Compass, 
  Eye, 
  Sun, 
  Sunrise, 
  Sunset, 
  Cloud, 
  Activity 
} from 'lucide-react';
import { WeatherReport } from '../types';
import PremiumTiltCard from './PremiumTiltCard';

interface DetailGridProps {
  report: WeatherReport;
  isDarkTheme: boolean;
}

export default function DetailGrid({ report, isDarkTheme }: DetailGridProps) {
  const { current, airQuality } = report;

  // Get UV classification
  const getUvClassification = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400 border-orange-500/20 bg-orange-500/5' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
    return { text: 'Extreme', color: 'text-red-500 border-red-500/20 bg-red-500/5 font-bold' };
  };

  const uvClass = getUvClassification(current.uvIndex);

  // Get Humidity description
  const getHumidityDesc = (humidity: number) => {
    if (humidity < 30) return 'Dry air';
    if (humidity <= 60) return 'Comfortable';
    if (humidity <= 80) return 'Sticky';
    return 'Very humid';
  };

  // Get wind classification
  const getWindClassification = (speed: number) => {
    if (speed < 12) return 'Light breeze';
    if (speed < 29) return 'Moderate wind';
    if (speed < 49) return 'Strong wind';
    return 'Gale warning';
  };

  const metricCards = [
    // 1. Air Quality Index
    {
      id: 'aqi-metric',
      title: 'Air Quality (AQI)',
      value: airQuality.usAqi,
      unit: ' US AQI',
      desc: airQuality.label,
      badge: airQuality.color,
      icon: <Activity size={20} className="text-emerald-400 animate-[pulse_2s_infinite]" />,
      fullWidth: true,
      subInfo: airQuality.description,
      glowColor: 'emerald' as const,
    },
    // 2. Wind
    {
      id: 'wind-metric',
      title: 'Wind Speed',
      value: Math.round(current.windSpeed),
      unit: ' km/h',
      desc: getWindClassification(current.windSpeed),
      icon: <Wind size={20} className="text-teal-400" />,
      glowColor: 'sky' as const,
    },
    // 3. Humidity
    {
      id: 'humidity-metric',
      title: 'Humidity',
      value: current.humidity,
      unit: '%',
      desc: getHumidityDesc(current.humidity),
      icon: <Droplets size={20} className="text-blue-400 animate-bounce" style={{ animationDuration: '3s' }} />,
      glowColor: 'sky' as const,
    },
    // 4. UV Index
    {
      id: 'uv-metric',
      title: 'UV Index',
      value: current.uvIndex.toFixed(1),
      unit: '',
      desc: uvClass.text,
      badge: uvClass.color,
      icon: <Sun size={20} className="text-amber-400" />,
      glowColor: 'gold' as const,
    },
    // 5. Cloud Cover
    {
      id: 'clouds-metric',
      title: 'Cloud Cover',
      value: current.cloudPercentage,
      unit: '%',
      desc: current.cloudPercentage > 50 ? 'Mostly cloudy' : 'Mostly clear',
      icon: <Cloud size={20} className="text-slate-400" />,
      glowColor: 'slate' as const,
    },
    // 6. Visibility
    {
      id: 'visibility-metric',
      title: 'Visibility',
      value: current.visibility.toFixed(1),
      unit: ' km',
      desc: current.visibility >= 10 ? 'Excellent visibility' : 'Hazy conditions',
      icon: <Eye size={20} className="text-indigo-400" />,
      glowColor: 'sky' as const,
    },
    // 7. Pressure
    {
      id: 'pressure-metric',
      title: 'Pressure',
      value: Math.round(current.pressure),
      unit: ' hPa',
      desc: current.pressure > 1013 ? 'High pressure' : 'Low pressure',
      icon: <Compass size={20} className="text-pink-400" />,
      glowColor: 'slate' as const,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 fade-in">
      <h3 className={`text-lg font-display font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
        Weather Highlights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3.5" id="metric-grid">
        {metricCards.map((card, idx) => (
          <PremiumTiltCard
            key={card.id || idx}
            id={card.id}
            isDarkTheme={isDarkTheme}
            glowColor={card.glowColor}
            className={`${
              card.fullWidth ? 'sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3' : ''
            } ${
              isDarkTheme 
                ? 'glass-card border-white/10 text-white' 
                : 'glass-card-light border-slate-200/50 text-slate-800 shadow-sm'
            } rounded-[24px]`}
          >
            <div className="p-5 flex flex-col justify-between h-full min-h-[135px] gap-3">
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100'}`}>
                  {card.icon}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-extrabold">{card.value}</span>
                  <span className={`text-xs opacity-75 font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-slate-500'}`}>{card.unit}</span>
                  {card.badge && !card.fullWidth && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md border font-semibold ${card.badge}`}>
                      {card.desc}
                    </span>
                  )}
                </div>
                
                {card.fullWidth ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold border px-2 py-0.5 rounded-md ${card.badge}`}>
                        {card.desc}
                      </span>
                    </div>
                    <span className={`text-xs leading-relaxed mt-1 ${isDarkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                      {card.subInfo}
                    </span>
                  </div>
                ) : (
                  !card.badge && (
                    <span className={`text-xs font-semibold ${isDarkTheme ? 'text-slate-300 font-normal' : 'text-slate-600'}`}>
                      {card.desc}
                    </span>
                  )
                )}
              </div>
            </div>
          </PremiumTiltCard>
        ))}

        {/* 8. Sunrise & Sunset Card (Always full width of column grid) */}
        <PremiumTiltCard
          id="sun-metric"
          isDarkTheme={isDarkTheme}
          glowColor="gold"
          className={`sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 ${
            isDarkTheme 
              ? 'glass-card border-white/10 text-white' 
              : 'glass-card-light border-slate-200/50 text-slate-800 shadow-sm'
          } rounded-[24px]`}
        >
          <div className="p-5 flex flex-col justify-between h-full min-h-[135px]">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-semibold ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Sun Schedule
              </span>
              <div className={`p-1.5 rounded-lg ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100'}`}>
                <Sunrise size={20} className="text-orange-400 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {/* Sunrise */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/10">
                  <Sunrise size={20} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Sunrise</span>
                  <span className="text-sm font-extrabold">{current.sunrise}</span>
                </div>
              </div>

              {/* Sunset */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-400/10 text-indigo-400 border border-indigo-400/10">
                  <Sunset size={20} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Sunset</span>
                  <span className="text-sm font-extrabold">{current.sunset}</span>
                </div>
              </div>
            </div>
          </div>
        </PremiumTiltCard>
      </div>
    </div>
  );
}
