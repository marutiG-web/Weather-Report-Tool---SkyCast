import React, { useState } from 'react';
import { 
  Sun, 
  Sunset, 
  Sunrise, 
  Wind, 
  Droplets, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyForecastData, TempUnit } from '../types';
import WeatherIcon from './WeatherIcon';

interface WeeklyForecastProps {
  dailyList: DailyForecastData[];
  unit: TempUnit;
  isDarkTheme: boolean;
}

export default function WeeklyForecast({ dailyList, unit, isDarkTheme }: WeeklyForecastProps) {
  // Store the index of the expanded day card. Defaults to 0 (Today) being expanded!
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // collapse if clicked again
    } else {
      setExpandedIndex(index);
    }
  };

  // Stagger entry animations for forecast items
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -15, y: 5 },
    show: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 14 }
    },
  };

  return (
    <div className="w-full flex flex-col gap-4 fade-in">
      <h3 className={`text-lg font-display font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
        7-Day Forecast <span className="text-xs font-normal opacity-60">(Tap cards for details)</span>
      </h3>

      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2.5" 
        id="weekly-forecast-container"
      >
        {dailyList.map((day, index) => {
          const isExpanded = expandedIndex === index;
          
            return (
              <motion.div
                key={index}
                variants={rowVariants}
                whileHover={{ 
                  scale: 1.012, 
                  x: 3,
                  boxShadow: isDarkTheme 
                    ? '0 12px 24px -6px rgba(56, 189, 248, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.12)' 
                    : '0 12px 20px -6px rgba(31, 38, 135, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                }}
                whileTap={{ scale: 0.995 }}
                onClick={() => toggleExpand(index)}
                className={`w-full rounded-[24px] cursor-pointer overflow-hidden transition-all duration-500 border ${
                  isExpanded
                    ? isDarkTheme
                      ? 'bg-gradient-to-r from-white/[0.12] to-white/[0.04] border-white/25 shadow-xl'
                      : 'bg-white border-white shadow-lg'
                    : isDarkTheme
                      ? 'glass-card border-white/10 text-white'
                      : 'glass-card-light border-slate-200/50 text-slate-800 shadow-sm'
                }`}
              >
              {/* Primary Card View */}
              <div className="flex items-center justify-between p-4 gap-4">
                {/* Date & Weekday */}
                <div className="flex flex-col min-w-[70px]">
                  <span className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                    {day.dayOfWeek}
                  </span>
                  <span className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    {day.date}
                  </span>
                </div>

                {/* Condition and Icon */}
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={`p-2 rounded-full ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100'}`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <WeatherIcon code={day.weatherCode} isDay={true} size={24} />
                  </motion.div>
                  {isExpanded && (
                    <span className={`text-xs font-bold uppercase hidden sm:inline ${isDarkTheme ? 'text-amber-300/95' : 'text-blue-600/90'}`}>
                      Day Highlights
                    </span>
                  )}
                </div>

                {/* Chance of Rain */}
                <div className="flex items-center gap-1.5 min-w-[60px] justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${day.precipitationProbabilityMax > 30 ? 'bg-sky-400 animate-pulse' : 'bg-slate-400/30'}`} />
                  <span className={`text-xs font-semibold ${isDarkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                    {day.precipitationProbabilityMax}% <span className="text-[10px] opacity-60 font-medium">Rain</span>
                  </span>
                </div>

                {/* Temp Slider Display (Min - Max) */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold opacity-60 min-w-[30px] text-right ${isDarkTheme ? 'text-slate-300' : 'text-slate-500'}`}>
                    {formatTemp(day.tempMin)}
                  </span>
                  {/* Visual progress-style line representation of temps */}
                  <div className="w-16 h-1.5 rounded-full bg-slate-300/25 relative overflow-hidden hidden xs:block">
                    <div 
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-rose-400"
                      style={{ left: '20%', right: '15%' }}
                    />
                  </div>
                  <span className={`text-sm font-extrabold min-w-[30px] ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                    {formatTemp(day.tempMax)}
                  </span>
                </div>

                {/* Expanded State indicator */}
                <div className={isDarkTheme ? 'text-slate-400' : 'text-slate-500'}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Detailed Expanded Section (with slide and fade in Framer Motion) */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                    onClick={(e) => e.stopPropagation()} // don't collapse if clicking details
                    className="overflow-hidden"
                  >
                    <div 
                      className={`p-4.5 border-t ${
                        isDarkTheme ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50/50'
                      } grid grid-cols-2 sm:grid-cols-4 gap-4.5`}
                    >
                      {/* UV Index */}
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-400/15 text-amber-400">
                          <Sun size={15} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>UV Index Max</span>
                          <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                            {Math.round(day.uvIndexMax)}
                          </span>
                        </div>
                      </div>

                      {/* Wind Speed */}
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-teal-400/15 text-teal-400">
                          <Wind size={15} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Max Wind</span>
                          <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                            {Math.round(day.windSpeedMax)} km/h
                          </span>
                        </div>
                      </div>

                      {/* Sunrise */}
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-orange-400/15 text-orange-400">
                          <Sunrise size={15} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Sunrise</span>
                          <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                            {day.sunrise}
                          </span>
                        </div>
                      </div>

                      {/* Sunset */}
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-400/15 text-indigo-400">
                          <Sunset size={15} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Sunset</span>
                          <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                            {day.sunset}
                          </span>
                        </div>
                      </div>

                      {/* Precip Sum */}
                      <div className="col-span-2 flex items-center gap-2.5 pt-1.5 border-t border-dashed border-white/5">
                        <div className="p-1.5 rounded-lg bg-sky-400/15 text-sky-400">
                          <Droplets size={15} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>Total Precipitation</span>
                          <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}`}>
                            {day.precipitationSum > 0 ? `${day.precipitationSum.toFixed(1)} mm` : 'No rain expected'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
