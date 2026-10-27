'use client';

import React, { useId } from 'react';
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

/** The BECOMING luminous orbit: lightweight, original animated SVG.
 * No external files, canvas, timers or frame-by-frame React rendering.
 * Animation stops automatically for prefers-reduced-motion.
 */
export function LivingLightIdentity({
  size = 280,
  className = '',
  interactive = false,
  simplified = false,
  reducedMotion,
  onSymbolClick,
  ariaLabel = 'BECOMING luminous orbit',
}: LivingLightIdentityProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const systemReduced = useReducedMotion();
  const still = reducedMotion ?? systemReduced ?? false;
  const animate = !still && !simplified;
  const svg = (
    <svg viewBox="0 0 320 320" width="100%" height="100%" role="img" aria-label={ariaLabel} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={id+'core'} cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#160F36"/>
          <stop offset=".58" stopColor="#100B29"/>
          <stop offset=".87" stopColor="#170B30"/>
          <stop offset="1" stopColor="#070613"/>
        </radialGradient>
        <linearGradient id={id+'rim'} x1="18" y1="12" x2="285" y2="292" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37E2FF"/><stop offset=".23" stopColor="#596BFF"/>
          <stop offset=".53" stopColor="#D54EFF"/><stop offset=".76" stopColor="#8935F6"/>
          <stop offset="1" stopColor="#FC62BD"/>
        </linearGradient>
        <linearGradient id={id+'warm'} x1="32" y1="190" x2="287" y2="218" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DD4BFA"/><stop offset=".28" stopColor="#FFAE4E"/>
          <stop offset=".58" stopColor="#FF693B"/><stop offset=".86" stopColor="#F94BA6"/>
          <stop offset="1" stopColor="#B43FFF"/>
        </linearGradient>
        <linearGradient id={id+'cool'} x1="56" y1="40" x2="242" y2="266" gradientUnits="userSpaceOnUse">
          <stop stopColor="#53DFFF"/><stop offset=".35" stopColor="#745AFF"/>
          <stop offset=".7" stopColor="#D64EF9"/><stop offset="1" stopColor="#5C56F0"/>
        </linearGradient>
        <filter id={id+'halo'} x="-55%" y="-55%" width="210%" height="210%"><feGaussianBlur stdDeviation="5"/></filter>
        <clipPath id={id+'clip'}><circle cx="160" cy="160" r="136"/></clipPath>
      </defs>
      <circle cx="160" cy="160" r="143" stroke={'url(#'+id+'rim)'} strokeWidth="8" opacity=".48" filter={'url(#'+id+'halo)'}/>
      <circle cx="160" cy="160" r="136" fill={'url(#'+id+'core)'}/>
      <g clipPath={'url(#'+id+'clip)'} className={animate ? 'becoming-orbit-flow' : ''}>
        <path d="M-17 205 C62 91 116 231 198 120 S318 97 353 159" stroke={'url(#'+id+'cool)'} strokeWidth="27" opacity=".18"/>
        <path d="M-10 207 C75 99 109 244 202 132 S311 92 348 157" stroke={'url(#'+id+'cool)'} strokeWidth="9" opacity=".43"/>
        <path d="M-9 207 C76 115 123 233 206 131 S305 102 345 157" stroke="#E0A1FF" strokeWidth="1.8" opacity=".74"/>
        <path d="M-19 171 C55 271 128 176 207 202 S304 272 345 117" stroke={'url(#'+id+'warm)'} strokeWidth="24" opacity=".26"/>
        <path d="M-18 169 C63 264 133 174 207 201 S303 271 350 113" stroke={'url(#'+id+'warm)'} strokeWidth="8" opacity=".8"/>
        <path d="M-18 176 C71 269 122 180 205 210 S309 264 349 110" stroke="#FFB26E" strokeWidth="2" opacity=".95"/>
      </g>
      <g className={animate ? 'becoming-orbit-ribbon' : ''}>
        <path d="M27 198 C65 248 129 258 195 220 S276 138 297 167" stroke={'url(#'+id+'warm)'} strokeWidth="2.5" opacity=".85"/>
        <path d="M32 106 C92 26 186 27 246 80" stroke={'url(#'+id+'cool)'} strokeWidth="3" opacity=".72"/>
      </g>
      <circle cx="160" cy="160" r="136" stroke={'url(#'+id+'rim)'} strokeWidth="4" opacity=".97"/>
      <path d="M30 114 A136 136 0 0 1 258 68" stroke="#8BEAFF" strokeWidth="1.4" opacity=".75"/>
      <path d="M35 217 A136 136 0 0 0 281 225" stroke="#E65BFA" strokeWidth="1.5" opacity=".69"/>
      <style>{`
        .becoming-orbit-flow{transform-origin:160px 160px;animation:becoming-flow 13s ease-in-out infinite alternate}
        .becoming-orbit-ribbon{transform-origin:160px 160px;animation:becoming-ribbon 17s ease-in-out infinite alternate}
        @keyframes becoming-flow{0%{transform:translate(-6px,2px) rotate(-7deg)}100%{transform:translate(7px,-3px) rotate(7deg)}}
        @keyframes becoming-ribbon{0%{transform:rotate(0deg)}100%{transform:rotate(12deg)}}
        @media(prefers-reduced-motion:reduce){.becoming-orbit-flow,.becoming-orbit-ribbon{animation:none!important}}
      `}</style>
    </svg>
  );
  const isButton = Boolean(onSymbolClick);
  return (
    <div className={className} style={{ width:size, height:size, maxWidth:'100%', flexShrink:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
      {isButton ? <button type="button" tabIndex={0} onClick={onSymbolClick} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSymbolClick?.(); } }} aria-label={ariaLabel} style={{width:'100%',height:'100%',background:'none',border:0,cursor:'pointer'}}>{svg}</button> : svg}
    </div>
  );
}
export default LivingLightIdentity;
