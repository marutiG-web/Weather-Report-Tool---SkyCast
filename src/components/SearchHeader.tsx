import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  Sun, 
  Moon, 
  History, 
  Star, 
  WifiOff,
  Settings,
  Trash2,
  Sliders,
  Check
} from 'lucide-react';
import { LocationData, TempUnit, SavedCity } from '../types';
import SkyCastLogo from './SkyCastLogo';

interface SearchHeaderProps {
  suggestions: LocationData[];
  onSearchChange: (value: string) => void;
  onSelectLocation: (loc: LocationData) => void;
  unit: TempUnit;
  onUnitToggle: () => void;
  favorites: SavedCity[];
  onRemoveFavorite: (id: string) => void;
  recentSearches: LocationData[];
  onLocateUser: () => void;
  isLocating: boolean;
  isOffline: boolean;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  autoLocationEnabled: boolean;
  onToggleAutoLocation: () => void;
  onClearRecentSearches: () => void;
}

export default function SearchHeader({
  suggestions,
  onSearchChange,
  onSelectLocation,
  unit,
  onUnitToggle,
  favorites,
  onRemoveFavorite,
  recentSearches,
  onLocateUser,
  isLocating,
  isOffline,
  isDarkTheme,
  onToggleTheme,
  autoLocationEnabled,
  onToggleAutoLocation,
  onClearRecentSearches,
}: SearchHeaderProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions and history when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);
    setShowSuggestions(value.length >= 2);
    if (value.length < 2) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  const handleFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowHistory(recentSearches.length > 0);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    setInputValue('');
    onSearchChange('');
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleClearInput = () => {
    setInputValue('');
    onSearchChange('');
    setShowSuggestions(false);
    setShowHistory(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 z-40" ref={containerRef}>
      {/* Offline Banner */}
      {isOffline && (
        <div className="w-full flex items-center justify-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl py-2 px-4 text-xs font-semibold animate-pulse">
          <WifiOff size={15} />
          <span>You are currently offline. Displaying cached weather data.</span>
        </div>
      )}

      {/* Main Bar: Logo, Search Box, Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 w-full p-4.5 md:px-6 md:py-4.5 rounded-[28px] border transition-all duration-500 ${
        isDarkTheme 
          ? 'glass-panel border-white/12 shadow-2xl' 
          : 'glass-panel-light border-white/60 shadow-lg'
      }`}>
        {/* Title branding */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <SkyCastLogo size={36} variant="full" isDarkTheme={isDarkTheme} />

          {/* Unified Controls Block (Theme, Unit, Settings) - ONLY visible on mobile inside header */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDarkTheme ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              title="Toggle theme"
            >
              {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            
            <button
              onClick={onUnitToggle}
              className={`px-2.5 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                isDarkTheme ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              title="Toggle Temperature Unit"
            >
              °{unit}
            </button>

            <button
              onClick={() => setShowSettings(prev => !prev)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                showSettings
                  ? 'bg-sky-500 text-white'
                  : isDarkTheme ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              title="Settings"
            >
              <Settings size={15} className={showSettings ? 'rotate-45' : ''} style={{ transition: 'transform 0.4s' }} />
            </button>
          </div>
        </div>

        {/* Search Container Box */}
        <div className="relative flex-grow max-w-xl w-full">
          <div className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input
                id="city-search"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder="Search city (e.g. Paris, Tokyo...)"
                disabled={isOffline}
                className={`w-full pl-10 pr-10 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none focus:ring-2 focus:ring-sky-500/30 ${
                  isDarkTheme 
                    ? 'glass-input text-white placeholder-slate-400' 
                    : 'glass-input-light text-slate-800 placeholder-slate-500'
                }`}
              />
              {inputValue && (
                <button
                  onClick={handleClearInput}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Locate User Trigger Button */}
            <button
              id="locate-btn"
              onClick={onLocateUser}
              disabled={isLocating || isOffline}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                isDarkTheme 
                  ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              }`}
              title="Detect my current location"
            >
              <MapPin size={18} className={isLocating ? 'animate-[spin_1s_linear_infinite]' : ''} />
            </button>
          </div>

          {/* Autocomplete suggestions dropdown list */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl p-2 z-50 border shadow-2xl animate-[fadeInEffect_0.2s_ease] ${
              isDarkTheme 
                ? 'glass-panel border-white/10 text-white' 
                : 'glass-panel-light border-slate-200 text-slate-800'
            }`}>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col gap-0.5 transition-all duration-200 ${
                    isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-bold">{suggestion.name}</span>
                  <span className={`text-[11px] opacity-70`}>
                    {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Search History Dropdown List (If search box is focused but has no input) */}
          {showHistory && recentSearches.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl p-3.5 z-50 border shadow-2xl animate-[fadeInEffect_0.2s_ease] ${
              isDarkTheme 
                ? 'glass-panel border-white/10 text-white' 
                : 'glass-panel-light border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold opacity-60 mb-2">
                <History size={13} />
                <span>RECENT SEARCHES</span>
              </div>
              <div className="flex flex-col gap-1">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex justify-between items-center ${
                      isDarkTheme ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{item.name}, {item.country}</span>
                    <span className="text-[10px] opacity-50 font-medium">Search again</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Large Screen Controls (Theme toggle, Temp Unit switch, Settings button) */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onToggleTheme}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isDarkTheme ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Theme"
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={onUnitToggle}
            className={`px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
              isDarkTheme ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Temperature Unit"
          >
            °{unit === 'C' ? 'Celsius' : 'Fahrenheit'}
          </button>

          <button
            onClick={() => setShowSettings(prev => !prev)}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              showSettings
                ? 'bg-sky-500 text-white'
                : isDarkTheme ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Open Settings"
          >
            <Settings size={18} className={showSettings ? 'rotate-45' : ''} style={{ transition: 'transform 0.4s' }} />
          </button>
        </div>
      </div>

      {/* Slide-Down Collapsible Settings Panel */}
      {showSettings && (
        <div className={`w-full rounded-3xl p-5 border shadow-xl animate-[fadeInEffect_0.25s_ease] flex flex-col gap-4 ${
          isDarkTheme 
            ? 'glass-panel border-white/10 text-white' 
            : 'glass-panel-light border-slate-200 text-slate-800'
        }`} id="settings-panel">
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-sky-400" />
              <h3 className="text-sm font-bold tracking-tight">Weather Settings</h3>
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className={`p-1 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Automatic Location Toggle */}
            <div className={`flex items-center justify-between p-3.5 rounded-2xl ${isDarkTheme ? 'bg-white/5' : 'bg-slate-50'} border border-white/5`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">Automatic Location Detection</span>
                <span className="text-[10px] opacity-60">Automatically locate me on startup</span>
              </div>
              <button
                onClick={onToggleAutoLocation}
                id="toggle-auto-location"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoLocationEnabled ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoLocationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Temperature Unit selection */}
            <div className={`flex items-center justify-between p-3.5 rounded-2xl ${isDarkTheme ? 'bg-white/5' : 'bg-slate-50'} border border-white/5`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">Temperature Unit</span>
                <span className="text-[10px] opacity-60">Celsius (°C) vs Fahrenheit (°F)</span>
              </div>
              <div className="flex gap-1 bg-black/10 p-1 rounded-xl">
                <button
                  onClick={() => unit !== 'C' && onUnitToggle()}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    unit === 'C' ? 'bg-sky-500 text-white' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => unit !== 'F' && onUnitToggle()}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    unit === 'F' ? 'bg-sky-500 text-white' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Theme Toggle selection */}
            <div className={`flex items-center justify-between p-3.5 rounded-2xl ${isDarkTheme ? 'bg-white/5' : 'bg-slate-50'} border border-white/5`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">App Theme Appearance</span>
                <span className="text-[10px] opacity-60">Dark mode reduces eye strain</span>
              </div>
              <div className="flex gap-1 bg-black/10 p-1 rounded-xl">
                <button
                  onClick={() => !isDarkTheme && onToggleTheme()}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                    isDarkTheme ? 'bg-sky-500 text-white' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Moon size={10} />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => isDarkTheme && onToggleTheme()}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                    !isDarkTheme ? 'bg-sky-500 text-slate-800' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Sun size={10} />
                  <span>Light</span>
                </button>
              </div>
            </div>

            {/* Clear history option */}
            <div className={`flex items-center justify-between p-3.5 rounded-2xl ${isDarkTheme ? 'bg-white/5' : 'bg-slate-50'} border border-white/5`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">Clear Cache & History</span>
                <span className="text-[10px] opacity-60">Clear recent search list</span>
              </div>
              <button
                onClick={onClearRecentSearches}
                disabled={recentSearches.length === 0}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all flex items-center gap-1 border ${
                  recentSearches.length === 0
                    ? 'opacity-40 cursor-not-allowed border-white/10'
                    : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/20'
                }`}
              >
                <Trash2 size={11} />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Pills Bar */}
      {favorites.length > 0 && (
        <div className="w-full flex flex-col gap-2 animate-[fadeInEffect_0.4s_ease]">
          <div className="flex items-center gap-1.5 text-xs font-bold opacity-65 pl-1">
            <Star size={13} className="text-amber-400" fill="currentColor" />
            <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-600'}>FAVORITE CITIES</span>
          </div>
          <div className="w-full flex flex-wrap gap-2 pb-1 overflow-x-auto custom-scrollbar">
            {favorites.map((city) => (
              <div
                key={city.id}
                className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  isDarkTheme 
                    ? 'glass-card border-white/10 text-white' 
                    : 'glass-card-light border-slate-200 text-slate-800'
                }`}
              >
                <button
                  onClick={() => onSelectLocation(city)}
                  className="hover:text-sky-400 transition-colors duration-200"
                >
                  {city.name}
                  {city.country_code && <span className="opacity-50 ml-1 text-[10px]">{city.country_code.toUpperCase()}</span>}
                </button>
                <button
                  onClick={() => onRemoveFavorite(city.id)}
                  className={`p-0.5 rounded-full transition-colors duration-200 ${
                    isDarkTheme ? 'hover:bg-white/15 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                  title="Remove from favorites"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
