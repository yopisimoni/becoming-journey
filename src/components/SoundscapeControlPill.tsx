'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SoundscapePreset } from '@/lib/audio/soundEngine';
import { Volume2, VolumeX, Music, CloudRain, Bell, ChevronDown } from 'lucide-react';

export function SoundscapeControlPill() {
  const { soundPreset, setSoundPreset, dict, playSingingBowl } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const presets: { id: SoundscapePreset; label: string; icon: React.ReactNode }[] = [
    { id: 'sanctuary', label: dict.audio.sanctuary, icon: <Music className="w-3.5 h-3.5 text-violet-muted" /> },
    { id: 'rain', label: dict.audio.rain, icon: <CloudRain className="w-3.5 h-3.5 text-mint-muted" /> },
    { id: 'bowl', label: dict.audio.bowl, icon: <Bell className="w-3.5 h-3.5 text-peach-muted" /> },
    { id: 'none', label: dict.audio.mute, icon: <VolumeX className="w-3.5 h-3.5 text-stone-mist" /> },
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
        className={`px-2.5 py-1.5 rounded-full border text-xs flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-md ${
          soundPreset !== 'none'
            ? 'bg-violet-soft/80 border-violet-muted/40 text-violet-deep font-medium'
            : 'bg-ivory-100/80 border-stone-border text-stone-mist hover:text-stone-charcoal'
        }`}
      >
        {soundPreset !== 'none' ? (
          <Volume2 className="w-3.5 h-3.5 text-violet-deep animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline text-[11px] font-medium">
          {soundPreset !== 'none' ? currentMeta.label.split('(')[0].trim() : dict.audio.mute}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-mist" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 mt-1.5 w-48 rounded-2xl bg-ivory-50/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-border dark:border-white/10 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-mist border-b border-ivory-200 dark:border-white/5">
            {dict.audio.pillLabel}
          </div>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`w-full text-start px-3 py-2 flex items-center gap-2 transition-colors ${
                soundPreset === p.id
                  ? 'bg-violet-soft/60 dark:bg-violet-deep/30 font-semibold text-violet-deep dark:text-violet-soft'
                  : 'text-stone-charcoal dark:text-ivory-100 hover:bg-ivory-200/70 dark:hover:bg-white/5'
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
