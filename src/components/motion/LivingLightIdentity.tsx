'use client';

import React, { useRef, useEffect, useState, useCallback, useId } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface LivingLightIdentityProps {
  size?: number | string;
  className?: string;
  currentStep?: number;
  interactive?: boolean;
  simplified?: boolean;
  reducedMotion?: boolean;
  onSymbolClick?: () => void;
  ariaLabel?: string;
}

/**
 * BECOMING Living Light Identity (v0.9.3)
 * 
 * An original, lightweight, fluid brand identity composed of flowing ribbons of light
 * embracing a luminous central core.
 * 
 * Performance & Architecture:
 * - 100% Hardware-Accelerated SVG + GPU CSS Keyframes.
 * - ZERO React state updates during continuous ambient animation (0 re-renders at runtime).
 * - Component-scoped unique gradient IDs via React useId() (100% collision-free).
 * - Automatic visibility-based pausing via document.hidden to preserve mobile battery.
 * - Full prefers-reduced-motion accessibility compliance.
 * - Keyboard accessible if onSymbolClick is provided; clean role="img" when purely visual.
 */
export const LivingLightIdentity: React.FC<LivingLightIdentityProps> = ({
  size = 280,
  className = '',
  currentStep = 0,
  interactive = true,
  simplified = false,
  reducedMotion: propReducedMotion,
  onSymbolClick,
  ariaLabel = 'BECOMING Living Light Identity',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sysReducedMotion = useReducedMotion();
  const shouldReduceMotion = propReducedMotion ?? sysReducedMotion ?? false;

  // Unique component instance prefix for SVG gradient and filter IDs
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Pointer tilt & ripple state (updated only on explicit user events, NEVER on every frame)
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Pause GPU animations when tab is hidden to save mobile battery
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Pointer move handler with smooth tilt
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || shouldReduceMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Gentle tilt limit of ±6px
      setPointerOffset({
        x: normX * 6,
        y: normY * 6,
      });
    },
    [interactive, shouldReduceMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setPointerOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    setIsRippling(true);
    if (onSymbolClick) onSymbolClick();
    setTimeout(() => setIsRippling(false), 900);
  }, [interactive, onSymbolClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onSymbolClick) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick, onSymbolClick]
  );

  // Step-specific tonal harmony
  const stepHueRotations = [0, 15, -10, 25, -20];
  const stepHue = stepHueRotations[currentStep % stepHueRotations.length] || 0;

  // Animation play state
  const animPlayState = isVisible ? 'running' : 'paused';

  // Simplified icon variant for small sizes (favicons, navbar, app icons < 48px)
  if (simplified) {
    const smCyanBlueId = `${uid}-sm-cyan-blue`;
    const smLavVioletId = `${uid}-sm-lav-violet`;
    const smPeachChampId = `${uid}-sm-peach-champ`;
    const smCoreGlowId = `${uid}-sm-core-glow`;

    return (
      <div
        ref={containerRef}
        role={onSymbolClick ? 'button' : 'img'}
        tabIndex={onSymbolClick ? 0 : undefined}
        onKeyDown={onSymbolClick ? handleKeyDown : undefined}
        onClick={onSymbolClick ? handleClick : undefined}
        aria-label={ariaLabel}
        className={`relative inline-flex items-center justify-center select-none ${
          onSymbolClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full' : ''
        } ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id={smCyanBlueId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42C8FF" />
              <stop offset="100%" stopColor="#488CFF" />
            </linearGradient>
            <linearGradient id={smLavVioletId} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#BCA6FF" />
              <stop offset="100%" stopColor="#9667F4" />
            </linearGradient>
            <linearGradient id={smPeachChampId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB6A0" />
              <stop offset="100%" stopColor="#FFE0B5" />
            </linearGradient>
            <radialGradient id={smCoreGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="60%" stopColor="#FFE0B5" />
              <stop offset="100%" stopColor="#FFB6A0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Halo Rim */}
          <circle cx="50" cy="50" r="42" stroke={`url(#${smCyanBlueId})`} strokeWidth="4" opacity="0.4" />

          {/* Ribbon 1: Cyan/Blue Loop */}
          <path
            d="M 50 14 C 28 14 14 32 14 50 C 14 68 32 86 50 86 C 36 74 30 58 38 42 C 44 30 50 20 50 14 Z"
            fill={`url(#${smCyanBlueId})`}
            opacity="0.9"
          />

          {/* Ribbon 2: Lavender/Violet Loop */}
          <path
            d="M 50 14 C 72 14 86 32 86 50 C 86 68 68 86 50 86 C 64 74 70 58 62 42 C 56 30 50 20 50 14 Z"
            fill={`url(#${smLavVioletId})`}
            opacity="0.85"
          />

          {/* Ribbon 3: Warm Peach Cross Ribbon */}
          <path
            d="M 24 50 C 35 38 65 38 76 50 C 65 62 35 62 24 50 Z"
            fill={`url(#${smPeachChampId})`}
            opacity="0.9"
          />

          {/* Central Luminous Core */}
          <circle cx="50" cy="50" r="14" fill={`url(#${smCoreGlowId})`} />
          <circle cx="50" cy="50" r="5" fill="#FFF4D6" />
          <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // Full Cinematic Living Light Identity Unique IDs
  const cyanBlueId = `${uid}-grad-cyan-blue`;
  const lavVioletId = `${uid}-grad-lav-violet`;
  const peachChampId = `${uid}-grad-peach-champ`;
  const cyanLavId = `${uid}-grad-cyan-lav`;
  const violetPeachId = `${uid}-grad-violet-peach`;
  const haloRingId = `${uid}-grad-halo-ring`;
  const coreWarmId = `${uid}-grad-core-warm`;
  const softGlowId = `${uid}-soft-glow`;

  return (
    <div
      ref={containerRef}
      role={onSymbolClick ? 'button' : 'img'}
      tabIndex={onSymbolClick ? 0 : undefined}
      onKeyDown={onSymbolClick ? handleKeyDown : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      onClick={onSymbolClick ? handleClick : undefined}
      aria-label={onSymbolClick ? `${ariaLabel} — press Enter or Space to pulse` : ariaLabel}
      className={`relative inline-flex items-center justify-center select-none ${
        onSymbolClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        filter: stepHue !== 0 ? `hue-rotate(${stepHue}deg)` : undefined,
        transform: shouldReduceMotion
          ? undefined
          : `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0px) scale(${
              isRippling ? 1.04 : isHovered ? 1.02 : 1.0
            })`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
      }}
    >
      {/* Background Soft Atmospheric Radiance (GPU Keyframe breathing) */}
      <div
        aria-hidden="true"
        className="absolute inset-2 rounded-full pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(66, 200, 255, 0.22) 0%, rgba(188, 166, 255, 0.18) 35%, rgba(255, 182, 160, 0.12) 60%, rgba(8, 15, 41, 0) 80%)',
          opacity: isHovered ? 0.9 : 0.65,
          animation: shouldReduceMotion ? 'none' : 'becomingAtmosphericGlow 4.2s ease-in-out infinite',
          animationPlayState: animPlayState,
        }}
      />

      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block drop-shadow-[0_8px_32px_rgba(66,200,255,0.22)]"
      >
        <defs>
          {/* Ribbon 1: Electric Cyan to Ocean Blue */}
          <linearGradient id={cyanBlueId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#488CFF" stopOpacity="0.85" />
          </linearGradient>

          {/* Ribbon 2: Soft Lavender to Violet */}
          <linearGradient id={lavVioletId} x1="100%" y1="10%" x2="10%" y2="90%">
            <stop offset="0%" stopColor="#BCA6FF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0.8" />
          </linearGradient>

          {/* Ribbon 3: Warm Peach to Champagne Light */}
          <linearGradient id={peachChampId} x1="10%" y1="80%" x2="90%" y2="20%">
            <stop offset="0%" stopColor="#FFB6A0" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#FDA4AF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFE0B5" stopOpacity="0.95" />
          </linearGradient>

          {/* Ribbon 4: Electric Cyan to Soft Lavender */}
          <linearGradient id={cyanLavId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BCA6FF" stopOpacity="0.85" />
          </linearGradient>

          {/* Ribbon 5: Violet to Warm Peach */}
          <linearGradient id={violetPeachId} x1="80%" y1="10%" x2="20%" y2="90%">
            <stop offset="0%" stopColor="#9667F4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F472B6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFB6A0" stopOpacity="0.9" />
          </linearGradient>

          {/* Ribbon 6: Orbital Outer Ring Halo */}
          <linearGradient id={haloRingId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#BCA6FF" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#FFB6A0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0.55" />
          </linearGradient>

          {/* Central Luminous Warm Core Glow */}
          <radialGradient id={coreWarmId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFE0B5" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#FFB6A0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0" />
          </radialGradient>

          {/* Soft Filter for Core Sparkle */}
          <filter id={softGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 1: OUTER COSMIC HALO RING (Option B Circular Signature)   */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingHaloSpin 24s linear infinite',
            animationPlayState: animPlayState,
          }}
        >
          <circle
            cx="120"
            cy="120"
            r="98"
            stroke={`url(#${haloRingId})`}
            strokeWidth="3.5"
            strokeDasharray="18 10 32 14"
            opacity="0.45"
          />
          <circle
            cx="120"
            cy="120"
            r="94"
            stroke={`url(#${haloRingId})`}
            strokeWidth="1.5"
            opacity="0.3"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: RIBBON 1 — Electric Cyan/Blue Sweeping Embrace        */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingRibbon1 7.5s ease-in-out infinite',
            animationPlayState: animPlayState,
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 120 28 C 72 28 32 68 32 120 C 32 165 68 204 116 208 C 88 178 80 140 95 104 C 104 80 120 54 120 28 Z"
            fill={`url(#${cyanBlueId})`}
            opacity="0.9"
          />
          {/* Subtle inner highlight rim */}
          <path
            d="M 120 32 C 78 32 40 70 40 120 C 40 156 68 188 105 198"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 3: RIBBON 2 — Soft Lavender / Violet Counter-Wave         */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingRibbon2 8.5s ease-in-out infinite',
            animationPlayState: animPlayState,
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 120 28 C 168 28 208 68 208 120 C 208 165 172 204 124 208 C 152 178 160 140 145 104 C 136 80 120 54 120 28 Z"
            fill={`url(#${lavVioletId})`}
            opacity="0.88"
          />
          {/* Subtle outer highlight rim */}
          <path
            d="M 120 32 C 162 32 200 70 200 120 C 200 156 172 188 135 198"
            stroke="#FFE0B5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.32"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 4: RIBBON 3 — Warm Peach to Champagne Cradling Wave     */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingRibbon3 6.8s ease-in-out infinite',
            animationPlayState: animPlayState,
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 52 102 C 80 72 160 72 188 102 C 166 130 136 142 120 142 C 104 142 74 130 52 102 Z"
            fill={`url(#${peachChampId})`}
            opacity="0.9"
          />
          <path
            d="M 64 104 C 88 82 152 82 176 104"
            stroke="#FFF4D6"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 5: RIBBON 4 — Violet & Cyan Lower Horizon Loop           */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingRibbon4 7.2s ease-in-out infinite',
            animationPlayState: animPlayState,
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 52 138 C 80 168 160 168 188 138 C 166 110 136 98 120 98 C 104 98 74 110 52 138 Z"
            fill={`url(#${cyanLavId})`}
            opacity="0.82"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 6: RIBBON 5 — Diagonal Harmonic Ribbon (Option A Weave) */}
        {/* ============================================================== */}
        <g
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingRibbon5 11s ease-in-out infinite',
            animationPlayState: animPlayState,
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 60 60 C 110 85 130 155 180 180 C 155 186 90 155 60 60 Z"
            fill={`url(#${violetPeachId})`}
            opacity="0.78"
          />
          <path
            d="M 180 60 C 130 85 110 155 60 180 C 85 186 150 155 180 60 Z"
            fill={`url(#${cyanBlueId})`}
            opacity="0.7"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 7: CENTRAL LUMINOUS CORE — Seed of Awareness            */}
        {/* ============================================================== */}
        <g
          filter={`url(#${softGlowId})`}
          style={{
            transformOrigin: '120px 120px',
            animation: shouldReduceMotion ? 'none' : 'becomingCorePulse 3.8s ease-in-out infinite',
            animationPlayState: animPlayState,
          }}
        >
          {/* Outer Breathing Aura */}
          <circle cx="120" cy="120" r="32" fill={`url(#${coreWarmId})`} opacity="0.75" />

          {/* Middle Warm Glow */}
          <circle cx="120" cy="120" r="18" fill={`url(#${coreWarmId})`} opacity="0.9" />

          {/* Inner Bright Focal Seed */}
          <circle cx="120" cy="120" r="9" fill="#FFF4D6" opacity="0.98" />

          {/* Central Pure White Spark */}
          <circle cx="120" cy="120" r="4.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

export default LivingLightIdentity;
