import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface PremiumTiltCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  isDarkTheme?: boolean;
  glowColor?: 'sky' | 'gold' | 'emerald' | 'rose' | 'slate';
  maxTilt?: number; // Maximum tilt rotation in degrees
  key?: React.Key;
}

export default function PremiumTiltCard({
  children,
  className = '',
  id,
  onClick,
  isDarkTheme = true,
  glowColor = 'sky',
  maxTilt = 8,
}: PremiumTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tilt angles
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Soft spring config for fluid, lag-free 3D tilt
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);

  // Spotlight gradient coordinates
  const glowX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);

  // Calculate mouse position relative to the card bounds
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position from 0 to 1
    const relativeX = (event.clientX - rect.left) / width;
    const relativeY = (event.clientY - rect.top) / height;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt to center smoothly
    x.set(0.5);
    y.set(0.5);
  };

  // Select spotlight glow colors
  const getGlowColor = () => {
    if (isDarkTheme) {
      switch (glowColor) {
        case 'sky': return 'rgba(56, 189, 248, 0.15)';
        case 'gold': return 'rgba(245, 158, 11, 0.15)';
        case 'emerald': return 'rgba(16, 185, 129, 0.15)';
        case 'rose': return 'rgba(244, 63, 94, 0.15)';
        default: return 'rgba(255, 255, 255, 0.1)';
      }
    } else {
      switch (glowColor) {
        case 'sky': return 'rgba(56, 189, 248, 0.25)';
        case 'gold': return 'rgba(245, 158, 11, 0.22)';
        case 'emerald': return 'rgba(16, 185, 129, 0.22)';
        case 'rose': return 'rgba(244, 63, 94, 0.25)';
        default: return 'rgba(31, 38, 135, 0.08)';
      }
    }
  };

  // Convert spring values to React CSS variables or style objects
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const unsubX = glowX.on('change', (latestX) => {
      setGlowStyle((prev) => ({
        ...prev,
        background: `radial-gradient(circle 180px at ${latestX}% ${glowY.get()}%, ${getGlowColor()}, transparent 80%)`,
      }));
    });

    const unsubY = glowY.on('change', (latestY) => {
      setGlowStyle((prev) => ({
        ...prev,
        background: `radial-gradient(circle 180px at ${glowX.get()}% ${latestY}%, ${getGlowColor()}, transparent 80%)`,
      }));
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [glowColor, isDarkTheme, glowX, glowY]);

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative rounded-[24px] overflow-hidden ${className} ${
        onClick ? 'cursor-pointer select-none' : ''
      }`}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          ...glowStyle,
          opacity: isHovered ? 1 : 0,
          mixBlendMode: isDarkTheme ? 'screen' : 'multiply',
        }}
      />

      {/* Subtle border shine outline */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none z-20"
          style={{
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Card Content container (re-establishes perspective layer flat for standard renders inside) */}
      <div style={{ transform: 'translateZ(10px)' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
