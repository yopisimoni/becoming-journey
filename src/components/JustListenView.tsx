'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, Sparkles, Check } from 'lucide-react';

export function JustListenView() {
  const { dict, currentIntent, setActiveMode, reducedMotion } = useApp();
  const intent = currentIntent || 'lost';
  const script = dict.scripts[intent];

  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'in') return 'hold';
        if (prev === 'hold') return 'out';
        return 'in';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const breathText =
    breathPhase === 'in'
      ? dict.listen.inBreath
      : breathPhase === 'hold'
      ? dict.listen.holdBreath
      : dict.listen.outBreath;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-10">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex p-3 rounded-full bg-peach-soft dark:bg-peach-deep/30 text-peach-deep dark:text-peach-soft mb-2">
          <Volume2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-charcoal dark:text-ivory-100">
          {dict.listen.title}
        </h1>
        <p className="text-sm text-stone-mist dark:text-stone-300 max-w-md mx-auto">
          {dict.listen.subtitle}
        </p>
      </div>

      {/* Grounding Message */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-border/80 dark:border-white/10 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-stone-mist dark:text-stone-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-peach-muted" />
          <span>Grounding Reflection</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif italic text-stone-charcoal dark:text-ivory-100 leading-relaxed">
          &ldquo;{script.listenGrounding}&rdquo;
        </blockquote>
        <p className="text-xs sm:text-sm text-stone-mist dark:text-stone-300 pt-2">
          {dict.listen.calmMessage}
        </p>
      </div>

      {/* Gentle Breathing Visualizer */}
      {!reducedMotion ? (
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-28 h-28 rounded-full border-2 border-peach-muted/40 dark:border-peach-muted/30 bg-peach-soft/60 dark:bg-peach-deep/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
              breathPhase === 'in'
                ? 'scale-125 bg-peach-soft/90 dark:bg-peach-deep/40 shadow-lg shadow-peach-soft/50'
                : breathPhase === 'hold'
                ? 'scale-125 bg-peach-soft/70 dark:bg-peach-deep/30'
                : 'scale-90 bg-peach-soft/30 dark:bg-peach-deep/10'
            }`}
          >
            <span className="text-xs font-medium text-peach-deep dark:text-peach-soft">
              {breathText}
            </span>
          </div>
          <span className="text-xs text-stone-mist dark:text-stone-300">
            {dict.listen.breathPrompt}
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-900/80 border border-stone-border/80 dark:border-white/10 text-xs text-stone-mist dark:text-stone-300">
          <span>{dict.listen.breathPrompt} {dict.listen.calmMessage}</span>
        </div>
      )}

      {/* Return button */}
      <div className="pt-4">
        <button
          onClick={() => setActiveMode('guided')}
          className="px-6 py-2.5 rounded-2xl bg-stone-charcoal dark:bg-ivory-100 text-ivory-50 dark:text-stone-900 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          {dict.listen.finishListening}
        </button>
      </div>
    </div>
  );
}
