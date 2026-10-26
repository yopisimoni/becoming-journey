'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AtmosphereMode } from '@/types';
import { Palette, Check, Sparkles, Wand2 } from 'lucide-react';

interface AtmosphereOption {
  id: AtmosphereMode;
  nameKey: 'twilightName' | 'mossName' | 'dawnName' | 'midnightName';
  descKey: 'twilightDesc' | 'mossDesc' | 'dawnDesc' | 'midnightDesc';
  colorDot: string;
  badgeBg: string;
}

const ATMOSPHERE_OPTIONS: AtmosphereOption[] = [
  {
    id: 'twilight',
    nameKey: 'twilightName',
    descKey: 'twilightDesc',
    colorDot: 'bg-indigo-500 shadow-indigo-500/40',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'moss',
    nameKey: 'mossName',
    descKey: 'mossDesc',
    colorDot: 'bg-emerald-500 shadow-emerald-500/40',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'dawn',
    nameKey: 'dawnName',
    descKey: 'dawnDesc',
    colorDot: 'bg-amber-400 shadow-amber-400/40',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'midnight',
    nameKey: 'midnightName',
    descKey: 'midnightDesc',
    colorDot: 'bg-slate-300 dark:bg-slate-400 shadow-slate-500/40',
    badgeBg: 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700',
  },
];

export function AtmosphereSwitcher({ variant = 'navbar' }: { variant?: 'navbar' | 'dashboard' }) {
  const { atmosphere, setAtmosphere, autoAtmosphere, setAutoAtmosphere, dict, isRtl } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentOption = ATMOSPHERE_OPTIONS.find((opt) => opt.id === atmosphere) || ATMOSPHERE_OPTIONS[2];
  const currentName = dict.atmosphere?.[currentOption.nameKey] || currentOption.id;

  const handleSelect = (mode: AtmosphereMode) => {
    setAtmosphere(mode, true);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-start">
      {/* Trigger Pill Button */}
      <button
        id="atmosphere-switcher-btn"
        data-testid="atmosphere-switcher"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={dict.atmosphere?.switcherTitle || 'Atmosphere Canvas'}
        className={`group flex items-center gap-2 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs ${
          variant === 'navbar'
            ? 'px-2.5 py-1.5 sm:px-3 text-xs border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            : 'px-3.5 py-2 text-xs sm:text-sm font-medium border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 backdrop-blur-md'
        }`}
      >
        {/* Mood indicator dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110 ${currentOption.colorDot}`}
        />
        <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
        <span className="hidden md:inline font-medium tracking-tight">
          {currentName}
        </span>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label={dict.atmosphere?.switcherTitle || 'Atmosphere Canvas'}
          className={`absolute ${
            isRtl ? 'start-0' : 'end-0'
          } mt-2 w-80 sm:w-88 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-3 z-50 transition-all duration-300 animate-in fade-in zoom-in-95`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {dict.atmosphere?.switcherTitle || 'Atmosphere Canvas'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              v0.7 Ambient
            </span>
          </div>

          {/* 4 Mood Options */}
          <div className="space-y-1.5">
            {ATMOSPHERE_OPTIONS.map((opt) => {
              const isSelected = atmosphere === opt.id;
              const name = dict.atmosphere?.[opt.nameKey] || opt.id;
              const desc = dict.atmosphere?.[opt.descKey] || '';

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  data-testid={`atmosphere-option-${opt.id}`}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-start transition-all duration-200 ${
                    isSelected
                      ? `${opt.badgeBg} ring-1 ring-indigo-500/30 font-medium`
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${opt.colorDot}`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                        {name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
                        {desc}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ms-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Contextual Auto-Atmosphere Toggle */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 px-1">
            <label
              htmlFor="auto-atmosphere-toggle"
              className="flex items-start justify-between gap-2.5 cursor-pointer select-none"
            >
              <div className="flex items-start gap-2 min-w-0">
                <Wand2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {dict.atmosphere?.autoAtmosphere || 'Contextual Auto-Atmosphere'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {dict.atmosphere?.autoAtmosphereDesc ||
                      'Softly adapts ambient colors when entering Breathing & Vault studios'}
                  </div>
                </div>
              </div>

              <input
                id="auto-atmosphere-toggle"
                data-testid="auto-atmosphere-toggle"
                type="checkbox"
                checked={autoAtmosphere}
                onChange={(e) => setAutoAtmosphere(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
