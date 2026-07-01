import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchCitySuggestions, 
  fetchWeatherReport, 
  reverseGeocode, 
  getWeatherCondition 
} from './weatherService';
import { WeatherReport, LocationData, TempUnit, SavedCity } from './types';
import SearchHeader from './components/SearchHeader';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import DetailGrid from './components/DetailGrid';
import LoadingSkeleton from './components/LoadingSkeleton';
import AnimatedBackground from './components/AnimatedBackground';
import { CloudOff, AlertCircle, RefreshCw, Star, Share2, ClipboardCheck, MapPin } from 'lucide-react';

const DEFAULT_CITY: LocationData = {
  name: 'Tokyo',
  country: 'Japan',
  country_code: 'jp',
  latitude: 35.6762,
  longitude: 139.6503,
  timezone: 'Asia/Tokyo',
  admin1: 'Tokyo'
};

const SEED_FAVORITES: SavedCity[] = [
  {
    id: 'tokyo-fav',
    name: 'Tokyo',
    country: 'Japan',
    country_code: 'jp',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    admin1: 'Tokyo'
  },
  {
    id: 'london-fav',
    name: 'London',
    country: 'United Kingdom',
    country_code: 'gb',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    admin1: 'England'
  },
  {
    id: 'ny-fav',
    name: 'New York',
    country: 'United States',
    country_code: 'us',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    admin1: 'New York'
  }
];

export default function App() {
  // --- States ---
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // User preferences states loaded from localStorage
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('selected-theme');
    if (saved) return saved === 'dark';
    return true; // Default to Dark mode
  });

  const [unit, setUnit] = useState<TempUnit>(() => {
    const saved = localStorage.getItem('temp-unit');
    return (saved as TempUnit) || 'C';
  });

  const [favorites, setFavorites] = useState<SavedCity[]>(() => {
    const saved = localStorage.getItem('favorite-cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SEED_FAVORITES;
      }
    }
    return SEED_FAVORITES;
  });

  const [recentSearches, setRecentSearches] = useState<LocationData[]>(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings: Automatic location detection enabled
  const [autoLocationEnabled, setAutoLocationEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('auto-location-enabled');
    return saved === null ? true : saved === 'true';
  });

  // --- Theme Sync ---
  useEffect(() => {
    localStorage.setItem('selected-theme', isDarkTheme ? 'dark' : 'light');
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // --- Unit Sync ---
  useEffect(() => {
    localStorage.setItem('temp-unit', unit);
  }, [unit]);

  // --- Auto Location Enabled Sync ---
  useEffect(() => {
    localStorage.setItem('auto-location-enabled', String(autoLocationEnabled));
  }, [autoLocationEnabled]);

  // --- Offline Listener ---
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Show temporary toast alert ---
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000); // 4 seconds is perfect for informative toast reading
  }, []);

  // --- Core Weather Fetch logic ---
  const loadWeather = useCallback(async (location: LocationData, isCurrentGeoLoc = false) => {
    setLoading(true);
    setError(null);
    try {
      const locToLoad = { ...location };
      if (isCurrentGeoLoc) {
        locToLoad.isCurrentLocation = true;
      } else {
        delete locToLoad.isCurrentLocation;
      }

      const reportData = await fetchWeatherReport(locToLoad);
      setReport(reportData);
      
      // Save last successful location to localStorage
      localStorage.setItem('last-successful-location', JSON.stringify(locToLoad));

      // Save to recent searches (limit to last 5)
      setRecentSearches(prev => {
        const filtered = prev.filter(c => c.name.toLowerCase() !== locToLoad.name.toLowerCase());
        const updated = [locToLoad, ...filtered].slice(0, 5);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
        return updated;
      });

      // Save report cache
      localStorage.setItem('last-loaded-report', JSON.stringify(reportData));
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch weather data. Please check your internet connection or search another city.');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Initial Load cascade ---
  useEffect(() => {
    const loadFallbackLocation = async () => {
      // 1. Check last successful location first
      const savedLocStr = localStorage.getItem('last-successful-location');
      if (savedLocStr) {
        try {
          const savedLoc = JSON.parse(savedLocStr) as LocationData;
          await loadWeather(savedLoc, !!savedLoc.isCurrentLocation);
          return;
        } catch {
          // Fallback if corrupted
        }
      }

      // 2. Check report cache
      const cached = localStorage.getItem('last-loaded-report');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as WeatherReport;
          setReport(parsed);
          setLoading(false);
          // Refresh background fetch silently
          if (navigator.onLine) {
            fetchWeatherReport(parsed.location)
              .then(fresh => setReport(fresh))
              .catch(err => console.warn('Silent refresh failed', err));
          }
          return;
        } catch {
          // Proceed to next level if cache corrupted
        }
      }

      // 3. Fallback to default city
      await loadWeather(DEFAULT_CITY, false);
    };

    const loadInitial = async () => {
      // If auto location is enabled, request location on startup
      if (autoLocationEnabled && navigator.geolocation) {
        setIsLocating(true);
        setLoading(true);
        triggerToast('Detecting your current location weather...');

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const resolvedLoc = await reverseGeocode(latitude, longitude);
              await loadWeather(resolvedLoc, true);
              triggerToast(`Weather loaded for your location: ${resolvedLoc.name}`);
            } catch (err) {
              console.error('Error reverse geocoding on startup:', err);
              await loadFallbackLocation();
            } finally {
              setIsLocating(false);
            }
          },
          (geoError) => {
            setIsLocating(false);
            let friendlyError = '';
            switch (geoError.code) {
              case geoError.PERMISSION_DENIED:
                friendlyError = 'Location access was denied. Fallback city loaded. Go to Settings to toggle detection.';
                break;
              case geoError.POSITION_UNAVAILABLE:
                friendlyError = 'Device location unavailable or GPS disabled. Fallback city loaded.';
                break;
              case geoError.TIMEOUT:
                friendlyError = 'Location request timed out. Fallback city loaded.';
                break;
              default:
                friendlyError = 'Unable to find your location. Fallback city loaded.';
                break;
            }
            triggerToast(friendlyError);
            loadFallbackLocation();
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      } else {
        await loadFallbackLocation();
      }
    };

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadWeather]);

  // --- Autocomplete Trigger ---
  const handleSearchChange = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const results = await fetchCitySuggestions(query);
    setSuggestions(results);
  };

  // --- Selection of location ---
  const handleSelectLocation = (loc: LocationData) => {
    loadWeather(loc);
    setSuggestions([]);
  };

  // --- Geolocation Locator button trigger ---
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      triggerToast('Geolocation is not supported by your browser.');
      return;
    }
    
    setIsLocating(true);
    triggerToast('Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resolvedLoc = await reverseGeocode(latitude, longitude);
          await loadWeather(resolvedLoc, true);
          triggerToast(`Successfully located: ${resolvedLoc.name}`);
        } catch (err) {
          triggerToast('Error reverse geocoding location.');
          await loadWeather(DEFAULT_CITY, false);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Could not access location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permission denied. Please enable location permissions in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location unavailable. Please make sure GPS/location services are turned on.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please try again.';
            break;
          default:
            errorMsg = 'Location access failed. Please ensure GPS is enabled.';
            break;
        }
        triggerToast(errorMsg);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
    triggerToast('Search history cleared.');
  };

  // --- Favorite Operations ---
  const handleToggleFavorite = () => {
    if (!report) return;
    const { location } = report;
    const isCurrentlyFav = favorites.some(f => f.name.toLowerCase() === location.name.toLowerCase());

    if (isCurrentlyFav) {
      // Remove
      const filtered = favorites.filter(f => f.name.toLowerCase() !== location.name.toLowerCase());
      setFavorites(filtered);
      localStorage.setItem('favorite-cities', JSON.stringify(filtered));
      triggerToast(`${location.name} removed from favorites.`);
    } else {
      // Add
      const newFav: SavedCity = {
        id: `${location.latitude}-${location.longitude}-${Date.now()}`,
        ...location
      };
      const updated = [...favorites, newFav];
      setFavorites(updated);
      localStorage.setItem('favorite-cities', JSON.stringify(updated));
      triggerToast(`${location.name} added to favorites!`);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const filtered = favorites.filter(f => f.id !== id);
    setFavorites(filtered);
    localStorage.setItem('favorite-cities', JSON.stringify(filtered));
    triggerToast('Favorite removed.');
  };

  // --- Manual Refresh weather ---
  const handleRefresh = () => {
    if (!report) return;
    triggerToast('Refreshing current weather details...');
    loadWeather(report.location);
  };

  // --- Share Weather action ---
  const handleShareWeather = () => {
    if (!report) return;
    const { location, current } = report;
    const formattedTemp = unit === 'F' 
      ? `${Math.round((current.temp * 9) / 5 + 32)}°F` 
      : `${Math.round(current.temp)}°C`;
    
    const shareText = `🌦️ Skycast Weather - ${location.name}, ${location.country}
Temperature: ${formattedTemp} (Feels like ${unit === 'F' ? `${Math.round((current.feelsLike * 9) / 5 + 32)}°F` : `${Math.round(current.feelsLike)}°C`})
Condition: ${current.weatherCondition}
Humidity: ${current.humidity}% | Wind: ${Math.round(current.windSpeed)} km/h
Last updated at ${current.lastUpdated}.`;

    if (navigator.share) {
      navigator.share({
        title: `Weather in ${location.name}`,
        text: shareText,
      }).catch(err => {
        // fallback to clipboard
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => triggerToast('Weather details copied to clipboard!'))
      .catch(() => triggerToast('Failed to copy weather details.'));
  };

  // Determine current weather category for background
  const currentCategory = report 
    ? getWeatherCondition(report.current.weatherCode, report.current.isDay).category 
    : 'sunny';

  const isCurrentFavorite = report 
    ? favorites.some(f => f.name.toLowerCase() === report.location.name.toLowerCase())
    : false;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans relative ${isDarkTheme ? 'dark text-white' : 'text-slate-800'}`}>
      {/* Luxury tactile noise grain overlay */}
      <div className="luxury-noise" />

      {/* 1. Dynamic Animated Ambient Background based on current weather code */}
      <AnimatedBackground category={currentCategory} isDarkTheme={isDarkTheme} />

      {/* 2. Page Content container */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 relative z-10">
        
        {/* Top Control Bar with search inputs and favorites */}
        <SearchHeader
          suggestions={suggestions}
          onSearchChange={handleSearchChange}
          onSelectLocation={handleSelectLocation}
          unit={unit}
          onUnitToggle={() => setUnit(prev => prev === 'C' ? 'F' : 'C')}
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          recentSearches={recentSearches}
          onLocateUser={handleLocateUser}
          isLocating={isLocating}
          isOffline={isOffline}
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setIsDarkTheme(prev => !prev)}
          autoLocationEnabled={autoLocationEnabled}
          onToggleAutoLocation={() => setAutoLocationEnabled(prev => !prev)}
          onClearRecentSearches={handleClearRecentSearches}
        />

        {/* --- DYNAMIC STATES --- */}
        {loading ? (
          <LoadingSkeleton isDarkTheme={isDarkTheme} />
        ) : error ? (
          <div className="w-full flex justify-center items-center py-16 animate-fade-in" id="error-card">
            <div className={`max-w-md w-full p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4 border ${
              isDarkTheme 
                ? 'glass-panel text-white border-white/15' 
                : 'glass-panel-light text-slate-800 border-slate-200'
            }`}>
              <div className="p-4 bg-red-500/10 rounded-full text-red-400 border border-red-500/10">
                <CloudOff size={42} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight">Weather Load Failed</h2>
              <p className={`text-sm leading-relaxed ${isDarkTheme ? 'text-slate-300' : 'text-slate-500'}`}>
                {error}
              </p>
              <div className="flex gap-2.5 w-full mt-3">
                <button
                  onClick={() => loadWeather(DEFAULT_CITY)}
                  className={`flex-grow py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Load Tokyo
                </button>
                <button
                  onClick={handleLocateUser}
                  className={`flex-grow py-3 px-4 rounded-xl text-xs font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    isDarkTheme ? 'bg-sky-500 hover:bg-sky-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <MapPin size={14} />
                  <span>Locate Me</span>
                </button>
              </div>
            </div>
          </div>
        ) : report ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left/Top Column: Current metrics and hourly cards */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              {/* Core visual card */}
              <CurrentWeatherCard
                report={report}
                unit={unit}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
                onRefresh={handleRefresh}
                onShare={handleShareWeather}
                isDarkTheme={isDarkTheme}
              />

              {/* Hourly sliders */}
              <HourlyForecast
                hourlyList={report.hourly}
                unit={unit}
                isDarkTheme={isDarkTheme}
              />
            </div>

            {/* Right/Bottom Column: 7-day forecast cards and highlights bento box */}
            <div className="lg:col-span-3 flex flex-col gap-6 w-full">
              {/* 7-day lists */}
              <WeeklyForecast
                dailyList={report.daily}
                unit={unit}
                isDarkTheme={isDarkTheme}
              />

              {/* Highlights grids */}
              <DetailGrid
                report={report}
                isDarkTheme={isDarkTheme}
              />
            </div>

          </div>
        ) : null}
      </main>

      {/* Floating Glass Toast Notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-xs font-bold border flex items-center gap-2 shadow-2xl z-50 animate-[fadeInEffect_0.3s_ease] glass-panel bg-slate-900/90 border-white/15 text-white">
          <ClipboardCheck size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
