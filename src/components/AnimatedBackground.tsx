import React, { useMemo } from 'react';

interface AnimatedBackgroundProps {
  category: 'sunny' | 'rain' | 'snow' | 'cloudy' | 'thunderstorm' | 'night';
  isDarkTheme: boolean;
}

export default function AnimatedBackground({ category, isDarkTheme }: AnimatedBackgroundProps) {
  // Generate random values once to avoid shifts on re-renders
  const rainDrops = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.8 + Math.random() * 0.8}s`,
      opacity: 0.15 + Math.random() * 0.45,
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${3 + Math.random() * 6}px`,
      opacity: 0.3 + Math.random() * 0.6,
    }));
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      delay: `${Math.random() * 3}s`,
      size: `${1 + Math.random() * 3}px`,
    }));
  }, []);

  const clouds = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${10 + Math.random() * 40}%`,
      delay: `${i * -15}s`,
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.1 + Math.random() * 0.15,
    }));
  }, []);

  // Theme-driven background gradients
  const baseGradient = useMemo(() => {
    if (isDarkTheme) {
      switch (category) {
        case 'sunny':
          return 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-indigo-950/15';
        case 'rain':
          return 'bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/25';
        case 'snow':
          return 'bg-gradient-to-br from-zinc-900 via-slate-900 to-sky-950/15';
        case 'cloudy':
          return 'bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950';
        case 'thunderstorm':
          return 'bg-gradient-to-br from-zinc-950 via-slate-950 to-purple-950/15';
        case 'night':
          return 'bg-gradient-to-br from-neutral-950 via-slate-900 to-indigo-950/25';
        default:
          return 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/15';
      }
    } else {
      switch (category) {
        case 'sunny':
          return 'bg-gradient-to-br from-sky-200/90 via-amber-50 to-sky-100/95';
        case 'rain':
          return 'bg-gradient-to-br from-slate-200/90 via-sky-50 to-blue-100/95';
        case 'snow':
          return 'bg-gradient-to-br from-sky-50/90 via-zinc-50 to-blue-50/80';
        case 'cloudy':
          return 'bg-gradient-to-br from-sky-100/90 via-slate-100 to-zinc-50';
        case 'thunderstorm':
          return 'bg-gradient-to-br from-slate-300/90 via-zinc-200 to-purple-100/90';
        case 'night':
          return 'bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950';
        default:
          return 'bg-gradient-to-br from-sky-100 via-amber-50 to-sky-100';
      }
    }
  }, [category, isDarkTheme]);

  // Premium floating glow orbs representing weather colors
  const glowOrbs = useMemo(() => {
    switch (category) {
      case 'sunny':
        return [
          { className: 'bg-amber-400/20 dark:bg-amber-500/10 top-[-10%] right-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] animate-ambient-1' },
          { className: 'bg-sky-400/15 dark:bg-sky-500/10 bottom-[-15%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] animate-ambient-2' }
        ];
      case 'rain':
        return [
          { className: 'bg-blue-600/12 dark:bg-blue-600/08 top-[5%] right-[5%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] animate-ambient-1' },
          { className: 'bg-slate-500/12 dark:bg-slate-700/08 bottom-[-10%] left-[5%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] animate-ambient-2' }
        ];
      case 'snow':
        return [
          { className: 'bg-zinc-300/15 dark:bg-zinc-300/08 top-[10%] right-[10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] animate-ambient-1' },
          { className: 'bg-sky-300/15 dark:bg-sky-400/08 bottom-[5%] left-[5%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] animate-ambient-2' }
        ];
      case 'cloudy':
        return [
          { className: 'bg-slate-400/15 dark:bg-slate-500/08 top-[-5%] right-[5%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] animate-ambient-1' },
          { className: 'bg-zinc-400/12 dark:bg-zinc-600/08 bottom-[-5%] left-[10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] animate-ambient-2' }
        ];
      case 'thunderstorm':
        return [
          { className: 'bg-purple-600/12 dark:bg-purple-600/08 top-[5%] right-[10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] animate-ambient-1' },
          { className: 'bg-slate-800/15 dark:bg-blue-900/08 bottom-[5%] left-[5%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] animate-ambient-2' }
        ];
      case 'night':
        return [
          { className: 'bg-indigo-600/12 dark:bg-indigo-600/08 top-[5%] right-[10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] animate-ambient-1' },
          { className: 'bg-slate-700/12 dark:bg-slate-800/08 bottom-[5%] left-[5%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] animate-ambient-2' }
        ];
      default:
        return [];
    }
  }, [category]);

  return (
    <div className={`fixed inset-0 w-full h-full -z-50 overflow-hidden transition-all duration-1000 ${baseGradient}`}>
      {/* Ambient Moving Glow Halos */}
      {glowOrbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute rounded-full blur-[80px] md:blur-[120px] pointer-events-none mix-blend-screen opacity-50 dark:opacity-40 ${orb.className}`}
        />
      ))}

      {/* 1. SUNNY/CLEAR EFFECT */}
      {category === 'sunny' && (
        <div className="absolute top-[-15%] right-[-5%] w-[450px] h-[450px] rounded-full blur-[70px] pointer-events-none opacity-50 dark:opacity-40 mix-blend-screen bg-gradient-to-r from-amber-400 to-orange-300 animate-sun-glow" />
      )}

      {/* 2. NIGHT EFFECT (twinkling stars and soft moonlight glow) */}
      {category === 'night' && (
        <>
          <div className="absolute top-[10%] left-[10%] w-[250px] h-[250px] rounded-full blur-[60px] pointer-events-none opacity-40 bg-indigo-500/20" />
          {stars.map((star) => (
            <div
              key={star.id}
              className="star-element"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
              }}
            />
          ))}
        </>
      )}

      {/* 3. CLOUDY EFFECT (drifting cloud layers) */}
      {(category === 'cloudy' || category === 'sunny' || category === 'rain' || category === 'thunderstorm') && (
        <>
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className={isDarkTheme ? 'cloud-element' : 'cloud-element-light'}
              style={{
                top: cloud.top,
                width: `${180 * cloud.scale}px`,
                height: `${100 * cloud.scale}px`,
                animationDelay: cloud.delay,
                opacity: cloud.opacity,
              }}
            />
          ))}
        </>
      )}

      {/* 4. RAIN EFFECT */}
      {category === 'rain' && (
        <>
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className={isDarkTheme ? 'rain-drop' : 'rain-drop-light'}
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
                top: `-${Math.random() * 20}px`,
              }}
            />
          ))}
        </>
      )}

      {/* 5. SNOW EFFECT */}
      {category === 'snow' && (
        <>
          {snowFlakes.map((flake) => (
            <div
              key={flake.id}
              className="snow-flake"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
                opacity: flake.opacity,
                top: `-${Math.random() * 20}px`,
              }}
            />
          ))}
        </>
      )}

      {/* 6. THUNDERSTORM EFFECT */}
      {category === 'thunderstorm' && (
        <>
          <div className="lightning-bg" />
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className={isDarkTheme ? 'rain-drop' : 'rain-drop-light'}
              style={{
                left: drop.left,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
                top: `-${Math.random() * 20}px`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
