'use client';

import React from 'react';

interface ArtProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-28 h-28',
  lg: 'w-44 h-44',
  hero: 'w-56 h-56 sm:w-72 sm:h-72',
};

/**
 * Opening Sanctuary Art: A breathing sacred lotus orb with pulsating concentric halos
 */
export function SanctuaryLotusOrbArt({ className = '', size = 'hero' }: ArtProps) {
  return (
    <div
      role="img"
      aria-label="Sanctuary Lotus & Glowing Orb"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FAF7EE" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#FDECE7" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#EBE7F5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B7FB8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7FB8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D97A60" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="petalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5A9E74" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B7FB8" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Ambient Pulsing Aura Rings */}
        <circle cx="100" cy="100" r="90" fill="url(#orbGlow)" className="animate-pulse" opacity="0.35" />
        <circle cx="100" cy="100" r="75" stroke="#EAE1C4" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        <circle cx="100" cy="100" r="60" stroke="#8B7FB8" strokeWidth="1.2" opacity="0.3" />

        {/* Lotus Petals Layer 1 (Outer) */}
        <g opacity="0.7" transform="rotate(0 100 100)">
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(45 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(90 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(135 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(180 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(225 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(270 100 100)" />
          <path d="M100 45 C115 70, 125 85, 100 115 C75 85, 85 70, 100 45 Z" fill="url(#petalGrad1)" transform="rotate(315 100 100)" />
        </g>

        {/* Lotus Petals Layer 2 (Inner Swirl) */}
        <g opacity="0.85">
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(22.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(67.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(112.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(157.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(202.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(247.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(292.5 100 100)" />
          <path d="M100 60 C110 80, 115 90, 100 110 C85 90, 90 80, 100 60 Z" fill="url(#petalGrad2)" transform="rotate(337.5 100 100)" />
        </g>

        {/* Central Luminous Pearl / Core */}
        <circle cx="100" cy="100" r="14" fill="#FAF7EE" filter="drop-shadow(0px 0px 8px rgba(217,122,96,0.5))" />
        <circle cx="100" cy="100" r="6" fill="#D97A60" opacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Lost Art: Drifting mist & glowing guiding compass star
 */
export function LostCompassMistArt({ className = '', size = 'md' }: ArtProps) {
  return (
    <div
      role="img"
      aria-label="Glowing compass star in gentle mist"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="mist1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EBE7F5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B7FB8" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FAF7EE" stopOpacity="1" />
            <stop offset="40%" stopColor="#EAE1C4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B7FB8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Drifting Mist Waves */}
        <path d="M15 110 C40 95, 70 120, 100 105 C130 90, 150 115, 155 110" stroke="url(#mist1)" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
        <path d="M5 130 C30 115, 65 140, 105 125 C135 110, 150 135, 158 128" stroke="url(#mist1)" strokeWidth="18" strokeLinecap="round" opacity="0.3" />

        {/* Star Glow Aura */}
        <circle cx="80" cy="65" r="38" fill="url(#starGlow)" />

        {/* 8-Point Compass Star */}
        <g transform="translate(80, 65)">
          {/* Main 4 Points */}
          <path d="M0 -34 L5 -8 L30 0 L5 8 L0 34 L-5 8 L-30 0 L-5 -8 Z" fill="#8B7FB8" />
          {/* Diagonal 4 Points */}
          <path d="M0 -22 L3 -6 L20 0 L3 6 L0 22 L-3 6 L-20 0 L-3 -6 Z" fill="#EAE1C4" transform="rotate(45)" opacity="0.85" />
          {/* Center Pearl */}
          <circle cx="0" cy="0" r="3.5" fill="#FAF7EE" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Goal Art: Mountain silhouette beneath an ascending golden sunrise
 */
export function GoalMountainSunriseArt({ className = '', size = 'md' }: ArtProps) {
  return (
    <div
      role="img"
      aria-label="Rising sun over calm mountain ridges"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDECE7" />
            <stop offset="60%" stopColor="#D97A60" />
            <stop offset="100%" stopColor="#5A9E74" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A9E74" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#234932" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="mountGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7FB8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3D3457" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Rising Sun */}
        <circle cx="80" cy="70" r="28" fill="url(#sunGrad)" opacity="0.9" />
        <circle cx="80" cy="70" r="38" stroke="#D97A60" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />

        {/* Distant Mountain Peak */}
        <polygon points="15,145 65,75 115,145" fill="url(#mountGrad2)" opacity="0.65" />

        {/* Foreground Mountain Peak */}
        <polygon points="50,145 105,65 160,145" fill="url(#mountGrad1)" />

        {/* Ascending Path Micro-Step Indicator */}
        <circle cx="88" cy="115" r="2.5" fill="#FAF7EE" />
        <circle cx="96" cy="98" r="2.5" fill="#FAF7EE" opacity="0.85" />
        <circle cx="105" cy="80" r="3" fill="#FAF7EE" />
      </svg>
    </div>
  );
}

/**
 * Struggle Art: Calming water ripples under a protective warm shelter arch
 */
export function StruggleWaterShelterArt({ className = '', size = 'md' }: ArtProps) {
  return (
    <div
      role="img"
      aria-label="Warm shelter protecting calm water ripples"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="hearthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDECE7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#D97A60" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D97A60" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Protective Dome / Arch */}
        <path
          d="M25 130 C25 60, 135 60, 135 130"
          stroke="#D97A60"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M38 130 C38 78, 122 78, 122 130"
          stroke="#8B7FB8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.5"
        />

        {/* Hearth Warm Core Glow */}
        <circle cx="80" cy="95" r="22" fill="url(#hearthGlow)" />
        <circle cx="80" cy="95" r="5" fill="#FAF7EE" />

        {/* Settling Water Ripples */}
        <ellipse cx="80" cy="132" rx="42" ry="7" stroke="#8B7FB8" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="80" cy="136" rx="26" ry="4.5" stroke="#5A9E74" strokeWidth="1.2" opacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * Grow Art: Unfurling botanical leaf sprig with gentle sunbeam rays
 */
export function GrowBotanicalLeavesArt({ className = '', size = 'md' }: ArtProps) {
  return (
    <div
      role="img"
      aria-label="Botanical leaves unfurling into sunlight"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6F4EA" />
            <stop offset="50%" stopColor="#5A9E74" />
            <stop offset="100%" stopColor="#234932" />
          </linearGradient>
        </defs>

        {/* Sunbeam Aura Lines */}
        <line x1="80" y1="20" x2="80" y2="40" stroke="#EAE1C4" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="120" y1="35" x2="108" y2="50" stroke="#EAE1C4" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="40" y1="35" x2="52" y2="50" stroke="#EAE1C4" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Main Organic Stem */}
        <path d="M80 145 C80 110, 80 80, 80 50" stroke="#5A9E74" strokeWidth="3" strokeLinecap="round" />

        {/* Left Bottom Leaf */}
        <path d="M80 115 C55 115, 45 95, 80 90 C80 102, 80 110, 80 115 Z" fill="url(#leafGrad)" />

        {/* Right Middle Leaf */}
        <path d="M80 90 C105 90, 115 70, 80 65 C80 77, 80 85, 80 90 Z" fill="url(#leafGrad)" />

        {/* Top Fresh Sprout Leaf */}
        <path d="M80 55 C70 38, 90 38, 80 55 Z" fill="#5A9E74" />

        {/* Dew Drop Pearl */}
        <circle cx="56" cy="98" r="2.5" fill="#FAF7EE" />
      </svg>
    </div>
  );
}
