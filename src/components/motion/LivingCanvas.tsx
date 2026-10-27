'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AtmosphericOrb } from './AtmosphericOrb';
import {
  CircadianPhase,
  CIRCADIAN_PALETTES,
  getCircadianPhase,
} from '@/lib/theme/livingCanvasTokens';

export interface LivingCanvasProps {
  phase?: CircadianPhase;
  className?: string;
  children?: React.ReactNode;
  intensity?: 'subtle' | 'ambient' | 'vibrant';
  fixed?: boolean;
}

export const LivingCanvas: React.FC<LivingCanvasProps> = ({
  phase: explicitPhase,
  className = '',
  children,
  intensity = 'ambient',
  fixed = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentPhase, setCurrentPhase] = useState<CircadianPhase>(
    explicitPhase || getCircadianPhase()
  );
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Sync with explicitPhase prop if passed, or update periodically based on time
  useEffect(() => {
    if (explicitPhase) {
      setCurrentPhase(explicitPhase);
      return;
    }
    const update = () => setCurrentPhase(getCircadianPhase());
    update();
    const interval = setInterval(update, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [explicitPhase]);

  // Pause heavy motion when browser tab is inactive to preserve battery
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const palette = CIRCADIAN_PALETTES[currentPhase] || CIRCADIAN_PALETTES.day;

  // Opacity multipliers based on intensity
  const opacityMultiplier = intensity === 'subtle' ? 0.4 : intensity === 'vibrant' ? 0.9 : 0.65;

  return (
    <div
      className={`relative w-full overflow-hidden transition-colors duration-1000 ease-in-out ${
        fixed ? 'fixed inset-0 pointer-events-none -z-10' : ''
      } ${className}`}
      style={{
        backgroundColor: palette.canvasBg,
      }}
    >
      {/* Dynamic Ambient Gradient Underlayer */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${palette.gradientMesh} opacity-60 transition-opacity duration-1000`}
        aria-hidden="true"
      />

      {/* Atmospheric Orbs Layer (Only animated if tab is visible and not reduced motion) */}
      {isTabVisible && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Top-right Primary Orb */}
          <AtmosphericOrb
            color={palette.accentPrimary}
            size={460}
            blur={90}
            duration={16}
            opacity={0.35 * opacityMultiplier}
            className="-top-24 -end-24"
            drift={{ x: [0, -30], y: [0, 25] }}
          />

          {/* Bottom-left Secondary Orb */}
          <AtmosphericOrb
            color={palette.accentSecondary}
            size={400}
            blur={85}
            duration={20}
            delay={3}
            opacity={0.3 * opacityMultiplier}
            className="-bottom-20 -start-20"
            drift={{ x: [0, 25], y: [0, -35] }}
          />

          {/* Central breathing resonance orb */}
          <AtmosphericOrb
            color={palette.glowColor}
            size={520}
            blur={110}
            duration={24}
            delay={1.5}
            opacity={0.25 * opacityMultiplier}
            className="top-1/3 left-1/2 -translate-x-1/2"
            pulseScale={shouldReduceMotion ? [1, 1] : [0.94, 1.06]}
          />
        </div>
      )}

      {/* Subtle Micro-Texture Overlay for tactile grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay dark:opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Foreground Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
