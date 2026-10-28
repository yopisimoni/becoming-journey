'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  CircadianPhase,
  CIRCADIAN_PALETTES,
  getCircadianPhase,
  LIVING_MOTION,
} from '@/lib/theme/livingCanvasTokens';

export interface TheBecomingHorizonProps {
  currentPhase?: CircadianPhase;
  onPhaseChange?: (phase: CircadianPhase, isManual: boolean) => void;
  className?: string;
  compact?: boolean;
}

const PHASES: Array<{
  id: CircadianPhase;
  label: string;
  timeRange: string;
  icon: typeof Sunrise;
  color: string;
}> = [
  { id: 'dawn', label: 'Dawn', timeRange: '5 AM – 10 AM', icon: Sunrise, color: '#D97736' },
  { id: 'day', label: 'Daylight', timeRange: '10 AM – 5 PM', icon: Sun, color: '#5B7B6D' },
  { id: 'dusk', label: 'Twilight', timeRange: '5 PM – 9 PM', icon: Sunset, color: '#818CF8' },
  { id: 'night', label: 'Sanctuary', timeRange: '9 PM – 5 AM', icon: Moon, color: '#38BDF8' },
];

export const TheBecomingHorizon: React.FC<TheBecomingHorizonProps> = ({
  currentPhase: externalPhase,
  onPhaseChange,
  className = '',
  compact = false,
}) => {
  const { locale } = useApp();
  const copy: Record<string, string[]> = {
    en: ['The Living Horizon','Reset to Live','Live Sync Active','Dawn','Daylight','Twilight','Sanctuary','Reset to Real-Time Clock'],
    ar: ['الأفق الحي','العودة للوقت الحالي','المزامنة مفعلة','الفجر','النهار','الغسق','الهدوء','العودة إلى الساعة الفعلية'],
    fr: ['Horizon vivant','Retour en direct','Synchronisation active','Aube','Jour','Crépuscule','Sanctuaire','Revenir à l’heure actuelle'],
    es: ['Horizonte vivo','Volver al directo','Sincronización activa','Amanecer','Día','Crepúsculo','Refugio','Volver a la hora actual'],
    it: ['Orizzonte vivente','Torna in diretta','Sincronizzazione attiva','Alba','Giorno','Crepuscolo','Rifugio','Torna all’ora attuale'],
  };
  const labels = copy[locale] || copy.en;
  const [internalPhase, setInternalPhase] = useState<CircadianPhase>(
    externalPhase || getCircadianPhase()
  );
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  const activePhase = externalPhase || internalPhase;

  // Real-time clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      if (!isManualOverride) {
        const computed = getCircadianPhase(now.getHours());
        setInternalPhase(computed);
        onPhaseChange?.(computed, false);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [isManualOverride, onPhaseChange]);

  const handleSelectPhase = (phase: CircadianPhase) => {
    setIsManualOverride(true);
    setInternalPhase(phase);
    onPhaseChange?.(phase, true);
  };

  const handleResetToAuto = () => {
    setIsManualOverride(false);
    const computed = getCircadianPhase();
    setInternalPhase(computed);
    onPhaseChange?.(computed, false);
  };

  const activePalette = CIRCADIAN_PALETTES[activePhase];

  return (
    <div
      aria-label="The Becoming Horizon — Circadian Atmospheric Controller"
      className={`relative overflow-hidden rounded-3xl border border-stone-200/40 bg-white/70 p-4 backdrop-blur-xl transition-all duration-700 dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-5 ${className}`}
      style={{
        boxShadow: `0 8px 32px 0 ${activePalette.glowColor}`,
      }}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="pointer-events-none absolute -inset-1 opacity-25 blur-2xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activePalette.accentPrimary}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Header bar: Clock & Mode Status */}
      <div className="relative mb-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: activePalette.accentPrimary }}>
            <span
              className="inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: activePalette.accentPrimary }}
            />
          </span>
          <span className="font-medium tracking-wide uppercase text-stone-500 dark:text-slate-400">
            {labels[0]}
          </span>
          {currentTime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock className="h-3 w-3" />
              {currentTime}
            </span>
          )}
        </div>

        {isManualOverride ? (
          <button
            onClick={handleResetToAuto}
            className="group flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 transition hover:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-300"
            title={labels[7]}
          >
            <RotateCcw className="h-3 w-3 transition-transform group-hover:-rotate-90" />
            <span>{labels[1]}</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-slate-300">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>{labels[2]}</span>
          </span>
        )}
      </div>

      {/* The Celestial Arc / Horizon Track */}
      <div className="relative my-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200/60 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, #D97736 0%, #5B7B6D 33%, #818CF8 66%, #38BDF8 100%)`,
          }}
        />
      </div>

      {/* Circadian Phase Selector Cards */}
      <div className="relative mt-3 grid grid-cols-4 gap-2">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const isActive = activePhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => handleSelectPhase(phase.id)}
              className={`group relative flex flex-col items-center justify-center rounded-2xl p-2 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400/50 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100/60 text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
              }`}
            >
              <div
                className="mb-1 rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.2)'
                    : `${phase.color}15`,
                }}
              >
                <Icon
                  className="h-4 w-4"
                  style={{
                    color: isActive ? 'currentColor' : phase.color,
                  }}
                />
              </div>

              <span className="text-[12px] font-semibold leading-tight">
                {labels[3 + PHASES.findIndex(p => p.id === phase.id)]}
              </span>

              {!compact && (
                <span
                  className={`mt-0.5 text-[9px] ${
                    isActive
                      ? 'text-stone-300 dark:text-stone-600'
                      : 'text-stone-600 dark:text-slate-300'
                  }`}
                >
                  {phase.timeRange}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="activeHorizonPill"
                  className="absolute -bottom-1 h-1 w-6 rounded-full"
                  style={{ backgroundColor: phase.color }}
                  transition={LIVING_MOTION.springSnappy}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
