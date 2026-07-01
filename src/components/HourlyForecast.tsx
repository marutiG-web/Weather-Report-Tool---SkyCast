import React from 'react';
import { Droplet, Wind } from 'lucide-react';
import { motion } from 'motion/react';
import { HourlyForecastData, TempUnit } from '../types';
import WeatherIcon from './WeatherIcon';

interface HourlyForecastProps {
  hourlyList: HourlyForecastData[];
  unit: TempUnit;
  isDarkTheme: boolean;
}

export default function HourlyForecast({ hourlyList, unit, isDarkTheme }: HourlyForecastProps) {
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  // Stagger entry animations for hourly forecast items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 }
    },
  };

  return (
    <div className="w-full flex flex-col gap-4 fade-in">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-display font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
          Hourly Forecast <span className="text-xs font-normal opacity-60">(Next 24h)</span>
        </h3>
      </div>

      {/* Horizontal Scroll Area with motion */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex gap-3 overflow-x-auto pb-3.5 pt-1 px-1 custom-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
        id="hourly-scroll-container"
      >
        {hourlyList.map((item, index) => {
          const isRainy = item.precipitationProbability > 0;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.03,
                boxShadow: isDarkTheme 
                  ? '0 12px 24px -10px rgba(56, 189, 248, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)' 
                  : '0 12px 20px -8px rgba(31, 38, 135, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
              }}
              whileTap={{ scale: 0.97 }}
              className={`flex-shrink-0 w-[100px] py-5 px-3 rounded-[24px] flex flex-col items-center justify-between gap-4 text-center cursor-pointer select-none transition-all duration-300 border ${
                isDarkTheme 
                  ? 'glass-card border-white/10 text-white' 
                  : 'glass-card-light border-slate-200/50 text-slate-800 shadow-sm'
              }`}
            >
              {/* Hour time */}
              <span className="text-xs font-bold opacity-80 uppercase whitespace-nowrap">
                {item.time}
              </span>

              {/* Weather Icon container */}
              <motion.div 
                className={`p-2 rounded-full ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100'}`}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={28} />
              </motion.div>

              {/* Temperature */}
              <span className="text-base font-display font-extrabold tracking-tight">
                {formatTemp(item.temp)}
              </span>

              {/* Rain Chance / Wind indicators */}
              <div className="flex flex-col gap-1 items-center w-full mt-0.5">
                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${isRainy ? 'text-sky-400' : 'opacity-50 text-slate-400'}`}>
                  <Droplet size={11} className={isRainy ? 'animate-pulse' : ''} fill={isRainy ? 'currentColor' : 'none'} />
                  <span>{item.precipitationProbability}%</span>
                </div>
                
                <div className={`flex items-center gap-0.5 text-[10px] opacity-60 font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-500'}`}>
                  <Wind size={10} />
                  <span>{Math.round(item.windSpeed)}k/h</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
