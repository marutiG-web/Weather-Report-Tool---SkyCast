import React from 'react';
import { motion } from 'motion/react';

interface SkyCastLogoProps {
  size?: number; // width/height of the emblem
  variant?: 'icon' | 'full'; // 'icon' renders only the emblem, 'full' renders emblem + text
  isDarkTheme?: boolean;
}

export default function SkyCastLogo({
  size = 40,
  variant = 'icon',
  isDarkTheme = true,
}: SkyCastLogoProps) {
  // SVG gradients and paths for high-fidelity 3D rendering
  return (
    <div className="flex items-center gap-3 select-none" id="skycast-logo-container">
      {/* 3D Glassy Emblem */}
      <motion.div
        className="relative flex items-center justify-center rounded-[24%] overflow-hidden cursor-pointer"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #072e54 0%, #031424 100%)',
          boxShadow: isDarkTheme
            ? 'inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 12px rgba(14, 165, 233, 0.2)'
            : 'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(3, 20, 36, 0.15), 0 0 8px rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
        }}
        whileHover="hover"
        animate="idle"
      >
        {/* Sky/Atmosphere ambient glow inside the emblem */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-blue-600/5 to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 p-[12%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sun Gradients */}
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            
            {/* Glassy Cloud Gradient */}
            <linearGradient id="glassCloud" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
            </linearGradient>

            {/* Glossy highlight for 3D cloud edge */}
            <linearGradient id="cloudBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>

            {/* Raindrop Gradient */}
            <linearGradient id="raindropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Cloud shadow filter */}
            <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#010c17" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* 1. SUN RAYS & SUN BODY */}
          <motion.g
            variants={{
              hover: { rotate: 30, scale: 1.05 },
              idle: { rotate: 0, scale: 1 }
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="origin-[40px_38px]"
          >
            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
              const rad = (angle * Math.PI) / 180;
              const r1 = 15;
              const r2 = 20;
              const cx = 40;
              const cy = 38;
              const x1 = cx + r1 * Math.cos(rad);
              const y1 = cy + r1 * Math.sin(rad);
              const x2 = cx + r2 * Math.cos(rad);
              const y2 = cy + r2 * Math.sin(rad);
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              );
            })}

            {/* Sun core */}
            <circle cx="40" cy="38" r="13" fill="url(#sunGlow)" />
          </motion.g>

          {/* 2. RAIN DROPS */}
          <g>
            {/* Left drop */}
            <motion.path
              d="M33 65 C33 67.5 31 69 29 69 C27 69 25 67.5 25 65 C25 62 29 57 29 57 C29 57 33 62 33 65 Z"
              fill="url(#raindropGrad)"
              variants={{
                hover: { y: [0, 4, 0], opacity: [0.7, 1, 0.7] },
                idle: { y: 0, opacity: 0.85 }
              }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                delay: 0.1,
                ease: 'easeInOut'
              }}
            />
            {/* Middle drop */}
            <motion.path
              d="M44 68 C44 70.5 42 72 40 72 C38 72 36 70.5 36 68 C36 65 40 60 40 60 C40 60 44 65 44 68 Z"
              fill="url(#raindropGrad)"
              variants={{
                hover: { y: [0, 5, 0], opacity: [0.7, 1, 0.7] },
                idle: { y: 0, opacity: 0.85 }
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: 0.4,
                ease: 'easeInOut'
              }}
            />
            {/* Right drop */}
            <motion.path
              d="M55 64 C55 66.5 53 68 51 68 C49 68 47 66.5 47 64 C47 61 51 56 51 56 C51 56 55 61 55 64 Z"
              fill="url(#raindropGrad)"
              variants={{
                hover: { y: [0, 4, 0], opacity: [0.7, 1, 0.7] },
                idle: { y: 0, opacity: 0.85 }
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0.25,
                ease: 'easeInOut'
              }}
            />
          </g>

          {/* 3. SNOWFLAKES */}
          <g>
            {/* Left Snowflake */}
            <motion.g
              variants={{
                hover: { rotate: -180, scale: 1.15 },
                idle: { rotate: 0, scale: 1 }
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="origin-[65px_62px]"
            >
              <path
                d="M65 57 L65 67 M60 62 L70 62 M61.5 58.5 L68.5 65.5 M61.5 65.5 L68.5 58.5"
                stroke="#e0f2fe"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx="65" cy="62" r="1" fill="#0284c7" />
            </motion.g>

            {/* Right Snowflake (smaller) */}
            <motion.g
              variants={{
                hover: { rotate: 180, scale: 1.1 },
                idle: { rotate: 0, scale: 1 }
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="origin-[76px_68px]"
            >
              <path
                d="M76 64 L76 72 M72 68 L80 68 M73.2 65.2 L78.8 70.8 M73.2 70.8 L78.8 65.2"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </motion.g>
          </g>

          {/* 4. VOLUMETRIC FROSTED GLASS CLOUD */}
          <motion.g
            variants={{
              hover: { translateY: -2.5, scale: 1.02 },
              idle: { translateY: 0, scale: 1 }
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            filter="url(#cloudShadow)"
          >
            {/* Under-shadow accent of cloud */}
            <path
              d="M26 54 C20 54 16 49 16 43 C16 36 21 32 28 32 C30 25 38 20 46 20 C56 20 63 26 65 34 C71 34 76 39 76 45 C76 50 71 54 65 54 Z"
              fill="#061f36"
              opacity="0.3"
            />
            {/* Main cloud fill */}
            <path
              d="M26 53 C20 53 16 48.5 16 42.5 C16 35.5 21 31.5 28 31.5 C30 24.5 38 19.5 46 19.5 C56 19.5 63 25.5 65 33.5 C71 33.5 76 38.5 76 44.5 C76 49.5 71 53 65 53 Z"
              fill="url(#glassCloud)"
              stroke="url(#cloudBorder)"
              strokeWidth="0.75"
            />
            {/* High-gloss highlights */}
            <path
              d="M46 20.5 C54.5 20.5 61.2 25.8 63.5 32.5 C61 31.2 57.5 30.5 54 30.5 C43 30.5 34 38.5 31.5 47.5 C29.5 47.8 27.5 48 26 48 C21.5 48 18 45.2 18 41.5 C18 36.2 21.8 32.5 28 32.5 C29.8 26 37 20.5 46 20.5 Z"
              fill="#ffffff"
              opacity="0.25"
            />
          </motion.g>
        </svg>

        {/* 3D Glass Inner Reflection Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
      </motion.div>

      {/* Flagship Brand Text */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span className={`text-xl font-display font-black tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
              Sky
            </span>
            <span className="text-xl font-display font-black tracking-tight bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Cast
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] font-mono font-medium tracking-[0.22em] uppercase ${isDarkTheme ? 'text-sky-300/60' : 'text-slate-500/75'}`}>
              WEATHER
            </span>
            <div className="h-[1px] w-6 bg-gradient-to-r from-sky-400 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}
