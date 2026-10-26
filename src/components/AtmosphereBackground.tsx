'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function AtmosphereBackground() {
  const { themeMode, reducedMotion } = useApp();
  const isTwilight = themeMode === 'twilight';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700"
    >
      {/* Base Tint */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isTwilight
            ? 'bg-[#0E0D14]'
            : 'bg-ivory-100'
        }`}
      />

      {/* Floating Aurora Blobs */}
      <div className="absolute inset-0 opacity-70 dark:opacity-50">
        {/* Blob 1: Violet/Indigo */}
        <div
          className={`absolute -top-[15%] start-[5%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-3xl transition-transform duration-1000 ${
            isTwilight ? 'bg-[#31254A]/40' : 'bg-violet-soft/60'
          } ${reducedMotion ? '' : 'animate-pulse'}`}
          style={{ animationDuration: '9s' }}
        />

        {/* Blob 2: Peach/Rose */}
        <div
          className={`absolute top-[35%] end-[5%] w-[40vw] h-[40vw] max-w-[480px] max-h-[480px] rounded-full blur-3xl transition-transform duration-1000 ${
            isTwilight ? 'bg-[#432320]/30' : 'bg-peach-soft/60'
          } ${reducedMotion ? '' : 'animate-pulse'}`}
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />

        {/* Blob 3: Mint/Teal */}
        <div
          className={`absolute -bottom-[10%] start-[25%] w-[50vw] h-[50vw] max-w-[580px] max-h-[580px] rounded-full blur-3xl transition-transform duration-1000 ${
            isTwilight ? 'bg-[#183626]/30' : 'bg-mint-soft/50'
          } ${reducedMotion ? '' : 'animate-pulse'}`}
          style={{ animationDuration: '15s', animationDelay: '4s' }}
        />
      </div>

      {/* Subtle Grain / Glass Filter Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px]" />
    </div>
  );
}
