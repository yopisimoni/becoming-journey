'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SoundscapePreset, SOUNDSCAPE_TRACKS, SoundscapeCategory } from '@/lib/audio/soundEngine';
import {
  Volume2,
  VolumeX,
  Volume1,
  Music,
  CloudRain,
  Bell,
  Waves,
  Zap,
  Radio,
  Wind,
  Flame,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function SoundscapeControlPill() {
  const { soundPreset, setSoundPreset, soundVolume, setSoundVolume, dict, playSingingBowl } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getTrackIcon = (id: SoundscapePreset) => {
    switch (id) {
      case 'sanctuary':
        return <Music className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'solfeggio':
        return <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />;
      case 'bowl':
        return <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'ocean':
        return <Waves className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />;
      case 'alpha':
        return <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'rhodes':
        return <Radio className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'brown':
        return <Volume1 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />;
      case 'breeze':
        return <Wind className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'hearth':
        return <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <VolumeX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />;
    }
  };

  const getTrackLabel = (trackId: SoundscapePreset) => {
    // If dict has a specialized localized label for this track, use it; otherwise fallback to defaultLabel
    const localized = (dict.audio as Record<string, string>)[trackId];
    if (localized) return localized;
    const meta = SOUNDSCAPE_TRACKS.find((t) => t.id === trackId);
    return meta ? meta.defaultLabel : trackId;
  };

  const currentTrackMeta = SOUNDSCAPE_TRACKS.find((p) => p.id === soundPreset);
  const currentLabel = soundPreset !== 'none' ? getTrackLabel(soundPreset) : dict.audio.mute;

  const handleSelect = (id: SoundscapePreset) => {
    setSoundPreset(id);
    if (id === 'bowl') {
      playSingingBowl();
    }
  };

  const categories: { id: SoundscapeCategory; label: string }[] = [
    { id: 'calm', label: dict.audio.catCalm || 'Calm & Relief' },
    { id: 'focus', label: dict.audio.catFocus || 'Focus & Clarity' },
    { id: 'nature', label: dict.audio.catNature || 'Nature & Warmth' },
  ];

  return (
    <div className="relative inline-block" ref={containerRef}>
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
        <span className="hidden sm:inline text-xs truncate max-w-[120px]">
          {currentLabel.split('(')[0].trim()}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 mt-2 w-72 sm:w-80 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {dict.audio.studioTitle || 'Soundscape Studio'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {dict.audio.studioSubtitle || '10 procedural harmonic audio tracks'}
              </p>
            </div>
            {soundPreset !== 'none' && (
              <button
                type="button"
                onClick={() => handleSelect('none')}
                className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
              >
                <VolumeX className="w-3 h-3" />
                <span>{dict.audio.mute}</span>
              </button>
            )}
          </div>

          {/* Volume Slider Control */}
          <div className="px-2 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>{dict.audio.volumeLabel || 'Studio Volume'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              aria-label="Studio Volume Slider"
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* 10 Tracks grouped by 3 categories */}
          <div className="max-h-72 overflow-y-auto space-y-3 pe-1">
            {categories.map((cat) => {
              const tracksInCat = SOUNDSCAPE_TRACKS.filter((t) => t.category === cat.id);
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat.label}
                  </div>
                  <div className="space-y-0.5">
                    {tracksInCat.map((track) => {
                      const isActive = soundPreset === track.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => handleSelect(track.id)}
                          className={`w-full text-start px-2.5 py-2 rounded-xl flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800/80'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0">{getTrackIcon(track.id)}</span>
                            <div className="truncate">
                              <div className="truncate text-xs">{getTrackLabel(track.id)}</div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-normal">
                                {track.description}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0 ms-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Mute */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleSelect('none')}
              className={`w-full text-start px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                soundPreset === 'none'
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>{dict.audio.mute}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
