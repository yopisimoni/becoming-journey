'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface AtmosphericOrbProps {
  color?: string;
  size?: number | string;
  blur?: number;
  duration?: number;
  delay?: number;
  className?: string;
  opacity?: number;
  pulseScale?: [number, number];
  drift?: { x?: [number, number]; y?: [number, number] };
}

export const AtmosphericOrb: React.FC<AtmosphericOrbProps> = ({
  color = 'rgba(217, 119, 54, 0.25)', // Sunrise amber fallback
  size = 380,
  blur = 80,
  duration = 12,
  delay = 0,
  className = '',
  opacity = 0.6,
  pulseScale = [0.92, 1.08],
  drift = { x: [-15, 15], y: [-10, 10] },
}) => {
  const shouldReduceMotion = useReducedMotion();
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full select-none ${className}`}
      style={{
        width: dimension,
        height: dimension,
        background: `radial-gradient(circle, ${color} 0%, rgba(255, 255, 255, 0) 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, opacity',
      }}
      animate={
        shouldReduceMotion
          ? { opacity: [opacity * 0.9, opacity] }
          : {
              scale: pulseScale,
              x: drift.x || 0,
              y: drift.y || 0,
              opacity: [opacity * 0.8, opacity * 1.05, opacity * 0.8],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
    />
  );
};
