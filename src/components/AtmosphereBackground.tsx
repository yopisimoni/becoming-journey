'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function AtmosphereBackground() {
  const { atmosphere, themeMode, reducedMotion } = useApp();
  const isDark =
    themeMode === 'twilight' || atmosphere === 'twilight' || atmosphere === 'midnight';

  // Base background tint by atmosphere
  const getBaseTint = () => {
    switch (atmosphere) {
      case 'twilight':
        return 'bg-[#0B1020]';
      case 'midnight':
        return 'bg-[#07080D]';
      case 'moss':
        return isDark ? 'bg-[#0B1712]' : 'bg-[#F1F5F2]';
      case 'dawn':
      default:
        return isDark ? 'bg-[#1A1815]' : 'bg-[#FAF7F2]';
    }
  };

  // Aurora blobs color definitions
  const getBlob1 = () => {
    switch (atmosphere) {
      case 'twilight':
        return 'bg-[#31254A]/50';
      case 'midnight':
        return 'bg-[#0F172A]/60';
      case 'moss':
        return isDark ? 'bg-[#1E432E]/50' : 'bg-[#86EFAC]/40';
      case 'dawn':
      default:
        return isDark ? 'bg-[#432320]/40' : 'bg-[#FDECE7]/80';
    }
  };

  const getBlob2 = () => {
    switch (atmosphere) {
      case 'twilight':
        return 'bg-[#1E293B]/50';
      case 'midnight':
        return 'bg-[#181824]/60';
      case 'moss':
        return isDark ? 'bg-[#2A5239]/40' : 'bg-[#A7F3D0]/50';
      case 'dawn':
      default:
        return isDark ? 'bg-[#3D2C1D]/40' : 'bg-[#FEF3C7]/70';
    }
  };

  const getBlob3 = () => {
    switch (atmosphere) {
      case 'twilight':
        return 'bg-[#1E1B4B]/40';
      case 'midnight':
        return 'bg-[#1E1B4B]/40';
      case 'moss':
        return isDark ? 'bg-[#133022]/50' : 'bg-[#6EE7B7]/35';
      case 'dawn':
      default:
        return isDark ? 'bg-[#2C2442]/40' : 'bg-[#EBE7F5]/70';
    }
  };

  return (
    <div
      aria-hidden="true"
      data-testid="atmosphere-canvas"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000 ease-in-out"
    >
      {/* Base Tint with 1000ms transition */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${getBaseTint()}`}
      />

      {/* Floating Aurora Blobs */}
      <div className="absolute inset-0 opacity-70 dark:opacity-60 transition-opacity duration-1000 ease-in-out">
        {/* Blob 1 */}
        <div
          className={`absolute -top-[15%] start-[5%] w-[45vw] h-[45vw] max-w-[560px] max-h-[560px] rounded-full blur-3xl transition-colors duration-1000 ease-in-out ${getBlob1()} ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
          style={{ animationDuration: '9s' }}
        />

        {/* Blob 2 */}
        <div
          className={`absolute top-[35%] end-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-3xl transition-colors duration-1000 ease-in-out ${getBlob2()} ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />

        {/* Blob 3 */}
        <div
          className={`absolute -bottom-[10%] start-[25%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-3xl transition-colors duration-1000 ease-in-out ${getBlob3()} ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
          style={{ animationDuration: '15s', animationDelay: '4s' }}
        />
      </div>

      {/* Subtle Grain / Glass Filter Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px]" />
    </div>
  );
}
