'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
 * BECOMING Living Light Identity
 * 
 * An original, lightweight, fluid brand identity composed of flowing ribbons of light
 * embracing a luminous central core.
 * 
 * Visual Heritage:
 * - Color Harmony: Cosmic Midnight (#080F29), Electric Cyan (#42C8FF), Ocean Blue (#488CFF),
 *   Soft Lavender (#BCA6FF), Violet (#9667F4), Warm Peach (#FFB6A0), Champagne (#FFE0B5), Central Glow (#FFF4D6).
 * - Geometry: 6 layered fluid ribbon paths forming an organic spherical light field.
 * - Performance: 100% SVG + CSS hardware-accelerated transforms (0 WebGL, 0 Three.js, ~3KB footprint).
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

  // Spring pointer state
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Time-driven animation phase for internal ribbon undulation
  const [animTime, setAnimTime] = useState(0);

  // Pause decorative animations when tab is hidden to save mobile battery
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Frame-rate independent gentle undulation loop
  useEffect(() => {
    if (shouldReduceMotion || !isVisible) return;

    let frameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      setAnimTime((t) => (t + delta) % 1000);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion, isVisible]);

  // Pointer move handler with smooth damping
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

  // Step-specific tonal harmony
  const stepHueRotations = [0, 15, -10, 25, -20];
  const stepHue = stepHueRotations[currentStep % stepHueRotations.length] || 0;

  // Calculate subtle trigonometric offsets for organic ribbon movement
  const t = animTime;
  const ribbon1Wave = Math.sin(t * 1.4) * 2.5;
  const ribbon2Wave = Math.cos(t * 1.2) * 2.5;
  const ribbon3Wave = Math.sin(t * 1.6 + 1.0) * 2.0;
  const ribbon4Wave = Math.cos(t * 1.3 + 2.0) * 2.0;
  const ribbon5Wave = Math.sin(t * 0.9 + 0.5) * 1.8;
  const coreScale = shouldReduceMotion ? 1 : 0.96 + Math.sin(t * 2.0) * 0.06 + (isRippling ? 0.22 : 0);

  // Simplified icon variant for small sizes (favicons, navbar, app icons < 48px)
  if (simplified) {
    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabel}
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="smCyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42C8FF" />
              <stop offset="100%" stopColor="#488CFF" />
            </linearGradient>
            <linearGradient id="smLavViolet" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#BCA6FF" />
              <stop offset="100%" stopColor="#9667F4" />
            </linearGradient>
            <linearGradient id="smPeachChamp" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB6A0" />
              <stop offset="100%" stopColor="#FFE0B5" />
            </linearGradient>
            <radialGradient id="smCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="60%" stopColor="#FFE0B5" />
              <stop offset="100%" stopColor="#FFB6A0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Halo Rim */}
          <circle cx="50" cy="50" r="42" stroke="url(#smCyanBlue)" strokeWidth="4" opacity="0.4" />

          {/* Ribbon 1: Cyan/Blue Loop */}
          <path
            d="M 50 14 C 28 14 14 32 14 50 C 14 68 32 86 50 86 C 36 74 30 58 38 42 C 44 30 50 20 50 14 Z"
            fill="url(#smCyanBlue)"
            opacity="0.9"
          />

          {/* Ribbon 2: Lavender/Violet Loop */}
          <path
            d="M 50 14 C 72 14 86 32 86 50 C 86 68 68 86 50 86 C 64 74 70 58 62 42 C 56 30 50 20 50 14 Z"
            fill="url(#smLavViolet)"
            opacity="0.85"
          />

          {/* Ribbon 3: Warm Peach Cross Ribbon */}
          <path
            d="M 24 50 C 35 38 65 38 76 50 C 65 62 35 62 24 50 Z"
            fill="url(#smPeachChamp)"
            opacity="0.9"
          />

          {/* Central Luminous Core */}
          <circle cx="50" cy="50" r="14" fill="url(#smCoreGlow)" />
          <circle cx="50" cy="50" r="5" fill="#FFF4D6" />
          <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // Full Cinematic Living Light Identity
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
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
      {/* Background Soft Atmospheric Radiance */}
      <div
        aria-hidden="true"
        className="absolute inset-2 rounded-full pointer-events-none -z-10 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(66, 200, 255, 0.22) 0%, rgba(188, 166, 255, 0.18) 35%, rgba(255, 182, 160, 0.12) 60%, rgba(8, 15, 41, 0) 80%)',
          opacity: isHovered ? 0.9 : 0.65,
          transform: `scale(${coreScale})`,
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
          <linearGradient id="gradCyanBlue" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#488CFF" stopOpacity="0.85" />
          </linearGradient>

          {/* Ribbon 2: Soft Lavender to Violet */}
          <linearGradient id="gradLavViolet" x1="100%" y1="10%" x2="10%" y2="90%">
            <stop offset="0%" stopColor="#BCA6FF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0.8" />
          </linearGradient>

          {/* Ribbon 3: Warm Peach to Champagne Light */}
          <linearGradient id="gradPeachChamp" x1="10%" y1="80%" x2="90%" y2="20%">
            <stop offset="0%" stopColor="#FFB6A0" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#FDA4AF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFE0B5" stopOpacity="0.95" />
          </linearGradient>

          {/* Ribbon 4: Electric Cyan to Soft Lavender */}
          <linearGradient id="gradCyanLav" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BCA6FF" stopOpacity="0.85" />
          </linearGradient>

          {/* Ribbon 5: Violet to Warm Peach */}
          <linearGradient id="gradVioletPeach" x1="80%" y1="10%" x2="20%" y2="90%">
            <stop offset="0%" stopColor="#9667F4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F472B6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFB6A0" stopOpacity="0.9" />
          </linearGradient>

          {/* Ribbon 6: Orbital Outer Ring Halo */}
          <linearGradient id="gradHaloRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#42C8FF" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#BCA6FF" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#FFB6A0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0.55" />
          </linearGradient>

          {/* Central Luminous Warm Core Glow */}
          <radialGradient id="gradCoreWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFE0B5" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#FFB6A0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9667F4" stopOpacity="0" />
          </radialGradient>

          {/* Soft Filter for Core Sparkle */}
          <filter id="softGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 1: OUTER COSMIC HALO RING (Option B Circular Signature)   */}
        {/* ============================================================== */}
        <g
          style={{
            transform: shouldReduceMotion
              ? undefined
              : `rotate(${animTime * 1.5}deg) scale(${1 + Math.sin(animTime) * 0.01})`,
            transformOrigin: '120px 120px',
            transition: 'transform 0.1s linear',
          }}
        >
          <circle
            cx="120"
            cy="120"
            r="98"
            stroke="url(#gradHaloRing)"
            strokeWidth="3.5"
            strokeDasharray="18 10 32 14"
            opacity="0.45"
          />
          <circle
            cx="120"
            cy="120"
            r="94"
            stroke="url(#gradHaloRing)"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: RIBBON 1 — Electric Cyan/Blue Sweeping Embrace        */}
        {/* ============================================================== */}
        <g
          style={{
            transform: shouldReduceMotion
              ? undefined
              : `translate(${ribbon1Wave * 0.7}px, ${ribbon1Wave * 0.4}px) scale(${
                  1 + Math.sin(animTime * 1.2) * 0.015
                })`,
            transformOrigin: '120px 120px',
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 120 28 C 72 28 32 68 32 120 C 32 165 68 204 116 208 C 88 178 80 140 95 104 C 104 80 120 54 120 28 Z"
            fill="url(#gradCyanBlue)"
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
            transform: shouldReduceMotion
              ? undefined
              : `translate(${ribbon2Wave * 0.7}px, ${-ribbon2Wave * 0.5}px) scale(${
                  1 + Math.cos(animTime * 1.1) * 0.018
                })`,
            transformOrigin: '120px 120px',
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 120 28 C 168 28 208 68 208 120 C 208 165 172 204 124 208 C 152 178 160 140 145 104 C 136 80 120 54 120 28 Z"
            fill="url(#gradLavViolet)"
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
            transform: shouldReduceMotion
              ? undefined
              : `translate(${-ribbon3Wave * 0.5}px, ${ribbon3Wave * 0.6}px) scaleY(${
                  1 + Math.sin(animTime * 1.5) * 0.025
                })`,
            transformOrigin: '120px 120px',
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 52 102 C 80 72 160 72 188 102 C 166 130 136 142 120 142 C 104 142 74 130 52 102 Z"
            fill="url(#gradPeachChamp)"
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
            transform: shouldReduceMotion
              ? undefined
              : `translate(${ribbon4Wave * 0.6}px, ${-ribbon4Wave * 0.4}px) scaleY(${
                  1 + Math.cos(animTime * 1.3) * 0.02
                })`,
            transformOrigin: '120px 120px',
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 52 138 C 80 168 160 168 188 138 C 166 110 136 98 120 98 C 104 98 74 110 52 138 Z"
            fill="url(#gradCyanLav)"
            opacity="0.82"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 6: RIBBON 5 — Diagonal Harmonic Ribbon (Option A Weave) */}
        {/* ============================================================== */}
        <g
          style={{
            transform: shouldReduceMotion
              ? undefined
              : `rotate(${ribbon5Wave * 2.5}deg) scale(${1 + Math.sin(animTime * 0.8) * 0.015})`,
            transformOrigin: '120px 120px',
            mixBlendMode: 'screen',
          }}
        >
          <path
            d="M 60 60 C 110 85 130 155 180 180 C 155 186 90 155 60 60 Z"
            fill="url(#gradVioletPeach)"
            opacity="0.78"
          />
          <path
            d="M 180 60 C 130 85 110 155 60 180 C 85 186 150 155 180 60 Z"
            fill="url(#gradCyanBlue)"
            opacity="0.7"
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 7: CENTRAL LUMINOUS CORE — Seed of Awareness            */}
        {/* ============================================================== */}
        <g
          filter="url(#softGlowFilter)"
          style={{
            transform: `scale(${coreScale})`,
            transformOrigin: '120px 120px',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Outer Breathing Aura */}
          <circle cx="120" cy="120" r="32" fill="url(#gradCoreWarm)" opacity="0.75" />

          {/* Middle Warm Glow */}
          <circle cx="120" cy="120" r="18" fill="url(#gradCoreWarm)" opacity="0.9" />

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
