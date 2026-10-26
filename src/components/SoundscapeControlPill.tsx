'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SoundscapePreset } from '@/lib/audio/soundEngine';
import { Volume2, VolumeX, Music, CloudRain, Bell, ChevronDown } from 'lucide-react';

export function SoundscapeControlPill() {
  const { soundPreset, setSoundPreset, dict, playSingingBowl } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const presets: { id: SoundscapePreset; label: string; icon: React.ReactNode }[] = [
    { id: 'sanctuary', label: dict.audio.sanctuary, icon: <Music className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> },
    { id: 'rain', label: dict.audio.rain, icon: <CloudRain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> },
    { id: 'bowl', label: dict.audio.bowl, icon: <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> },
    { id: 'none', label: dict.audio.mute, icon: <VolumeX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> },
  ];

  const currentMeta = presets.find((p) => p.id === soundPreset) || presets[3];

  const handleSelect = (id: SoundscapePreset) => {
    setSoundPreset(id);
    setIsOpen(false);
    if (id === 'bowl') {
      playSingingBowl();
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Soundscape Controls"
        aria-expanded={isOpen}
        className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-2 transition-all shadow-sm backdrop-blur-md font-medium ${
          soundPreset !== 'none'
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 font-semibold'
            : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white'
        }`}
      >
        {soundPreset !== 'none' ? (
          <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        )}
        <span className="hidden sm:inline text-xs">
          {soundPreset !== 'none' ? currentMeta.label.split('(')[0].trim() : dict.audio.mute}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 mt-2 w-52 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            {dict.audio.pillLabel}
          </div>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`w-full text-start px-3.5 py-2.5 flex items-center gap-2.5 transition-colors ${
                soundPreset === p.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              {p.icon}
              <span className="truncate">{p.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
