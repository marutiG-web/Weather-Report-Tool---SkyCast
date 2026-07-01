import React from 'react';
import { RefreshCw, Share2, Star, Clock, Calendar } from 'lucide-react';
import { WeatherReport, TempUnit } from '../types';
import WeatherIcon from './WeatherIcon';
import PremiumTiltCard from './PremiumTiltCard';

interface CurrentWeatherCardProps {
  report: WeatherReport;
  unit: TempUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  onShare: () => void;
  isDarkTheme: boolean;
}

export default function CurrentWeatherCard({
  report,
  unit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  onShare,
  isDarkTheme,
}: CurrentWeatherCardProps) {
  const { location, current, daily } = report;
  
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const todayForecast = daily[0];

  const getGlowColorType = () => {
    const code = current.weatherCode;
    // Clear/Sunny
    if (code === 0 || code === 1) return 'gold';
    // Thunderstorm
    if (code >= 95 && code <= 99) return 'rose';
    // Rain/Snow
    return 'sky';
  };

  return (
    <PremiumTiltCard
      id="current-weather-card"
      isDarkTheme={isDarkTheme}
      glowColor={getGlowColorType()}
      maxTilt={5}
      className={`w-full ${
        isDarkTheme ? 'glass-panel text-white border-white/15' : 'glass-panel-light text-slate-800 border-white/50'
      } rounded-[32px] shadow-2xl transition-all duration-300 animate-float-hero`}
    >
      <div className="p-6 md:p-8 flex flex-col justify-between relative h-full w-full overflow-hidden">
        {/* Absolute faint background glow */}
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        {/* Header Actions & City Details */}
        <div className="flex justify-between items-start w-full gap-4 z-10">
          <div>
            {location.isCurrentLocation && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
                isDarkTheme 
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Current Location</span>
              </div>
            )}
            <h2 className="text-2xl md:text-3.5xl font-display font-extrabold tracking-tight mb-1 flex items-center gap-2">
              {location.name}
              {location.country_code && (
                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${isDarkTheme ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                  {location.country_code.toUpperCase()}
                </span>
              )}
            </h2>
            {(location.admin1 || location.country) && (
              <p className={`text-xs mb-4 font-semibold ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </p>
            )}
            
            {/* Time and Date */}
            <div className="flex flex-col gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Clock size={14} className={isDarkTheme ? 'text-amber-400/80' : 'text-blue-600/80'} />
                <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-600'}>
                  {current.localTime} <span className="opacity-50 text-[10px] font-normal">(Local)</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className={isDarkTheme ? 'text-amber-400/80' : 'text-blue-600/80'} />
                <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-600'}>{current.localDate}</span>
              </div>
            </div>
          </div>

          {/* Buttons with micro-interactions */}
          <div className="flex gap-2">
            <button
              id="refresh-btn"
              onClick={onRefresh}
              className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 hover:scale-105 border ${
                isDarkTheme 
                  ? 'bg-white/5 hover:bg-white/15 text-white border-white/5' 
                  : 'bg-white/60 hover:bg-white/90 text-slate-700 border-slate-200/50 shadow-sm'
              }`}
              title="Refresh weather"
            >
              <RefreshCw size={16} className="hover:rotate-180 transition-all duration-500" />
            </button>
            <button
              id="share-btn"
              onClick={onShare}
              className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 hover:scale-105 border ${
                isDarkTheme 
                  ? 'bg-white/5 hover:bg-white/15 text-white border-white/5' 
                  : 'bg-white/60 hover:bg-white/90 text-slate-700 border-slate-200/50 shadow-sm'
              }`}
              title="Share weather"
            >
              <Share2 size={16} />
            </button>
            <button
              id="fav-btn"
              onClick={onToggleFavorite}
              className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 hover:scale-105 border ${
                isFavorite 
                  ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 border-amber-400/30 shadow-sm' 
                  : isDarkTheme 
                    ? 'bg-white/5 hover:bg-white/15 text-white border-white/5' 
                    : 'bg-white/60 hover:bg-white/90 text-slate-700 border-slate-200/50 shadow-sm'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
            </button>
          </div>
        </div>

        {/* Main Temp & Condition */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 my-8 md:my-10 z-10">
          <div className="flex items-center gap-5 md:gap-7">
            <div className={`p-4.5 rounded-[24px] ${isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/60'} border shadow-inner transition-all duration-300 hover:scale-105`}>
              <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={76} />
            </div>
            <div>
              <div className="text-6xl md:text-7.5xl font-display font-extrabold tracking-tighter select-none leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 dark:from-white dark:to-slate-200 bg-clip-text text-transparent drop-shadow-sm">
                {formatTemp(current.temp)}
              </div>
              <div className={`text-xs font-bold mt-2 uppercase tracking-widest ${isDarkTheme ? 'text-amber-400' : 'text-blue-600'}`}>
                {current.weatherCondition}
              </div>
            </div>
          </div>

          {/* Min/Max and Feels Like details */}
          <div className={`flex flex-col gap-2.5 p-4.5 rounded-2xl ${isDarkTheme ? 'bg-white/[0.04] border-white/5' : 'bg-white/80 border-slate-200/40 shadow-sm'} border text-xs font-bold min-w-[200px]`}>
            <div className="flex justify-between items-center gap-6">
              <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-500'}>FEELS LIKE</span>
              <span className="font-extrabold">{formatTemp(current.feelsLike)}</span>
            </div>
            {todayForecast && (
              <>
                <div className="w-full h-px bg-white/10" />
                <div className="flex justify-between items-center gap-6">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-500'}>MAX TEMP</span>
                  <span className="font-extrabold text-rose-400">{formatTemp(todayForecast.tempMax)}</span>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-500'}>MIN TEMP</span>
                  <span className="font-extrabold text-sky-400">{formatTemp(todayForecast.tempMin)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Last Updated Label */}
        <div className={`flex items-center justify-between text-[11px] font-bold z-10 ${isDarkTheme ? 'text-slate-400/80' : 'text-slate-500'}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Precipitation: </span>
            <span className={`${isDarkTheme ? 'text-sky-300' : 'text-sky-600'} font-extrabold`}>
              {current.chanceOfRain}%
            </span>
          </div>
          <div>
            <span>Updated: </span>
            <span className="font-mono opacity-80">{current.lastUpdated}</span>
          </div>
        </div>
      </div>
    </PremiumTiltCard>
  );
}
