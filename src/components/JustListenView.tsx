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
        <div className="inline-flex p-3.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 mb-2 border border-indigo-200 dark:border-indigo-800">
          <Volume2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
          {dict.listen.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {dict.listen.subtitle}
        </p>
      </div>

      {/* Grounding Message */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Grounding Reflection</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif italic text-slate-900 dark:text-white font-medium leading-relaxed">
          &ldquo;{script.listenGrounding}&rdquo;
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-2 font-normal">
          {dict.listen.calmMessage}
        </p>
      </div>

      {/* Gentle Breathing Visualizer */}
      {!reducedMotion ? (
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-32 h-32 rounded-full border-2 border-indigo-400/40 bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
              breathPhase === 'in'
                ? 'scale-125 bg-indigo-500/25 shadow-2xl shadow-indigo-500/30 ring-4 ring-indigo-400/20'
                : breathPhase === 'hold'
                ? 'scale-125 bg-indigo-500/20'
                : 'scale-90 bg-indigo-500/10'
            }`}
          >
            <span className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
              {breathText}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {dict.listen.breathPrompt}
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <span>{dict.listen.breathPrompt} {dict.listen.calmMessage}</span>
        </div>
      )}

      {/* Return button */}
      <div className="pt-4">
        <button
          onClick={() => setActiveMode('guided')}
          className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all"
        >
          {dict.listen.finishListening}
        </button>
      </div>
    </div>
  );
}
